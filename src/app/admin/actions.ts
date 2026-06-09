"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createConsultantAction(formData: FormData) {
  const owner = await requireOwner();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!fullName || !email || password.length < 8) return;

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) return;

  const { error: profileError } = await admin.from("profiles").insert({
    id: data.user.id,
    email,
    full_name: fullName,
    role: "consultant",
    active: true,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return;
  }

  await admin.from("access_logs").insert({
    consultant_id: data.user.id,
    event_type: "consultant_created",
    metadata: { created_by: owner.id },
  });
  revalidatePath("/admin");
}

export async function toggleConsultantAction(formData: FormData) {
  const owner = await requireOwner();
  const consultantId = String(formData.get("consultant_id") ?? "");
  const nextActive = String(formData.get("next_active") ?? "") === "true";
  if (!consultantId || consultantId === owner.id) return;

  const admin = createAdminClient();
  const { data: consultant } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", consultantId)
    .maybeSingle();
  if (!consultant || consultant.role !== "consultant") return;

  await admin.from("profiles").update({ active: nextActive }).eq("id", consultantId);
  await admin.from("access_logs").insert({
    consultant_id: consultantId,
    event_type: nextActive ? "consultant_enabled" : "consultant_disabled",
    metadata: { changed_by: owner.id },
  });
  revalidatePath("/admin");
}

export async function revokeAnyAccessAction(formData: FormData) {
  const owner = await requireOwner();
  const tokenId = String(formData.get("token_id") ?? "");
  if (!tokenId) return;

  const admin = createAdminClient();
  const { data: token } = await admin
    .from("access_tokens")
    .select("id, consultant_id")
    .eq("id", tokenId)
    .maybeSingle();
  if (!token) return;

  await admin
    .from("access_tokens")
    .update({ active: false, revoked_at: new Date().toISOString() })
    .eq("id", token.id);
  await admin.from("access_logs").insert({
    access_token_id: token.id,
    consultant_id: token.consultant_id,
    event_type: "access_revoked",
    metadata: { revoked_by: owner.id },
  });
  revalidatePath("/admin");
  revalidatePath("/consultor");
}
