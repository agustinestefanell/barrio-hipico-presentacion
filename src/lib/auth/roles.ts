import "server-only";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getViewerCookie } from "./viewer-cookie";

export type ProfileRole = "owner" | "consultant";

export type CurrentProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: ProfileRole;
  active: boolean;
  created_at: string;
};

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return data?.active ? (data as CurrentProfile) : null;
}

export async function requireOwner() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "owner") redirect("/consultor");
  return profile;
}

export async function requireConsultantOrOwner() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function hasValidViewerAccess() {
  if (!hasSupabaseEnv()) return false;
  const viewer = await getViewerCookie();
  if (!viewer) return false;

  const admin = createAdminClient();
  const { data } = await admin
    .from("access_tokens")
    .select("id, slug, active, revoked_at, expires_at, max_uses, used_count")
    .eq("id", viewer.accessTokenId)
    .eq("slug", viewer.slug)
    .maybeSingle();

  return Boolean(
    data &&
      data.active &&
      !data.revoked_at &&
      new Date(data.expires_at).getTime() > Date.now() &&
      data.used_count <= data.max_uses,
  );
}

export async function requirePresentationAccess() {
  const profile = await getCurrentProfile();
  if (profile) return { type: "profile" as const, profile };
  if (await hasValidViewerAccess()) return { type: "viewer" as const };
  redirect("/login");
}
