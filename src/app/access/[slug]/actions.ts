"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasAccessCookieSecret, hasSupabaseEnv } from "@/lib/supabase/env";
import { isValidPin, verifyPin } from "@/lib/auth/pin";
import { setViewerCookie } from "@/lib/auth/viewer-cookie";

export type ViewerAccessState = {
  error: string;
};

const GENERIC_ERROR = "PIN inválido o acceso no disponible.";

export async function viewerAccessAction(
  _previousState: ViewerAccessState,
  formData: FormData,
): Promise<ViewerAccessState> {
  if (!hasSupabaseEnv() || !hasAccessCookieSecret()) return { error: GENERIC_ERROR };

  const slug = String(formData.get("slug") ?? "");
  const pin = String(formData.get("pin") ?? "");
  if (!slug || !isValidPin(pin)) return { error: GENERIC_ERROR };

  const admin = createAdminClient();
  const { data: token } = await admin.from("access_tokens").select("*").eq("slug", slug).maybeSingle();
  if (!token) return { error: GENERIC_ERROR };

  const now = Date.now();
  const locked = token.locked_until && new Date(token.locked_until).getTime() > now;
  const expired = new Date(token.expires_at).getTime() <= now;
  const unavailable =
    !token.active || token.revoked_at || expired || token.used_count >= token.max_uses || locked;

  if (expired) {
    await admin.from("access_logs").insert({
      access_token_id: token.id,
      consultant_id: token.consultant_id,
      event_type: "pin_expired",
      metadata: { slug },
    });
  }
  if (unavailable) return { error: GENERIC_ERROR };

  if (!verifyPin(pin, token.pin_hash, token.pin_salt)) {
    const failedAttempts = token.failed_attempts + 1;
    const shouldLock = failedAttempts >= 5;
    const lockedUntil = shouldLock ? new Date(now + 15 * 60 * 1000).toISOString() : null;

    const { data: failedUpdate } = await admin
      .from("access_tokens")
      .update({ failed_attempts: failedAttempts, locked_until: lockedUntil })
      .eq("id", token.id)
      .eq("active", true)
      .eq("failed_attempts", token.failed_attempts)
      .select("id")
      .maybeSingle();
    if (!failedUpdate) return { error: GENERIC_ERROR };

    await admin.from("access_logs").insert({
      access_token_id: token.id,
      consultant_id: token.consultant_id,
      event_type: shouldLock ? "pin_locked" : "pin_failed",
      metadata: { failed_attempts: failedAttempts },
    });
    return { error: GENERIC_ERROR };
  }

  const usedCount = token.used_count + 1;
  const { data: successUpdate } = await admin
    .from("access_tokens")
    .update({ used_count: usedCount, failed_attempts: 0, locked_until: null })
    .eq("id", token.id)
    .eq("active", true)
    .is("revoked_at", null)
    .eq("used_count", token.used_count)
    .lt("used_count", token.max_uses)
    .gt("expires_at", new Date(now).toISOString())
    .select("id")
    .maybeSingle();
  if (!successUpdate) return { error: GENERIC_ERROR };

  await admin.from("access_logs").insert([
    {
      access_token_id: token.id,
      consultant_id: token.consultant_id,
      event_type: "pin_success",
      metadata: { used_count: usedCount },
    },
    {
      access_token_id: token.id,
      consultant_id: token.consultant_id,
      event_type: "viewer_session_created",
      metadata: { slug },
    },
  ]);

  const tokenExpiry = new Date(token.expires_at).getTime();
  await setViewerCookie({
    accessTokenId: token.id,
    slug,
    expiry: Math.min(tokenExpiry, now + 12 * 60 * 60 * 1000),
  });
  redirect("/");
}
