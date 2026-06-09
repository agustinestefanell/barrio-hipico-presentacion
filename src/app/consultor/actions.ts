"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateFourDigitPin, generatePinSalt, generateSlug, hashPin } from "@/lib/auth/pin";
import { requireConsultantOrOwner } from "@/lib/auth/roles";

export type CreateAccessState = {
  error: string;
  pin?: string;
  link?: string;
};

const ALLOWED_DAYS = new Set([1, 3, 7, 14, 30]);

export async function createAccessAction(
  _previousState: CreateAccessState,
  formData: FormData,
): Promise<CreateAccessState> {
  const profile = await requireConsultantOrOwner();
  const viewerName = String(formData.get("viewer_name") ?? "").trim();
  const viewerEmail = String(formData.get("viewer_email") ?? "").trim() || null;
  const requestedDays = Number(formData.get("expires_days") ?? 7);
  const days = ALLOWED_DAYS.has(requestedDays) ? requestedDays : 7;
  const maxUses = Math.min(20, Math.max(1, Number(formData.get("max_uses") ?? 3)));
  if (!viewerName) return { error: "Ingresá un nombre o alias para el invitado." };

  const slug = generateSlug();
  const pin = generateFourDigitPin();
  const salt = generatePinSalt();
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("access_tokens")
    .insert({
      consultant_id: profile.id,
      viewer_name: viewerName,
      viewer_email: viewerEmail,
      slug,
      pin_hash: hashPin(pin, salt),
      pin_salt: salt,
      expires_at: expiresAt,
      max_uses: maxUses,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "No se pudo crear el acceso." };
  await admin.from("access_logs").insert({
    access_token_id: data.id,
    consultant_id: profile.id,
    event_type: "access_created",
    metadata: { viewer_name: viewerName, expires_at: expiresAt, max_uses: maxUses },
  });
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  const link = host ? `${protocol}://${host}/access/${slug}` : `/access/${slug}`;
  revalidatePath("/consultor");
  revalidatePath("/admin");
  return { error: "", pin, link };
}

export async function revokeOwnAccessAction(formData: FormData) {
  const profile = await requireConsultantOrOwner();
  const tokenId = String(formData.get("token_id") ?? "");
  if (!tokenId) return;

  const admin = createAdminClient();
  const query = admin.from("access_tokens").select("id, consultant_id").eq("id", tokenId);
  const { data: token } = await query.maybeSingle();
  if (!token || (profile.role !== "owner" && token.consultant_id !== profile.id)) return;

  await admin
    .from("access_tokens")
    .update({ active: false, revoked_at: new Date().toISOString() })
    .eq("id", token.id);
  await admin.from("access_logs").insert({
    access_token_id: token.id,
    consultant_id: token.consultant_id,
    event_type: "access_revoked",
    metadata: { revoked_by: profile.id },
  });
  revalidatePath("/consultor");
  revalidatePath("/admin");
}
