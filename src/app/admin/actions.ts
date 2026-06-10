"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function approveConsultantAction(formData: FormData) {
  const owner = await requireOwner();
  const consultantId = String(formData.get("consultant_id") ?? "");
  if (!consultantId || consultantId === owner.id) return;

  const admin = createAdminClient();
  const { data: consultant } = await admin
    .from("profiles")
    .select("id, role, status")
    .eq("id", consultantId)
    .maybeSingle();
  if (!consultant || consultant.role !== "consultant" || consultant.status !== "pending") return;

  const { data: approved, error } = await admin
    .from("profiles")
    .update({ active: true, status: "active" })
    .eq("id", consultantId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();
  if (error || !approved) return;

  await admin.from("access_logs").insert({
    consultant_id: consultantId,
    event_type: "consultant_approved",
    metadata: { approved_by: owner.id },
  });
  revalidatePath("/admin");
}

export async function setConsultantStatusAction(formData: FormData) {
  const owner = await requireOwner();
  const consultantId = String(formData.get("consultant_id") ?? "");
  const nextStatus = String(formData.get("next_status") ?? "");
  if (!consultantId || consultantId === owner.id || !["active", "inactive"].includes(nextStatus)) return;

  const admin = createAdminClient();
  const { data: consultant } = await admin
    .from("profiles")
    .select("id, role, status")
    .eq("id", consultantId)
    .maybeSingle();
  if (
    !consultant ||
    consultant.role !== "consultant" ||
    !["active", "inactive"].includes(consultant.status)
  ) return;

  const nextActive = nextStatus === "active";
  const { data: updated, error } = await admin
    .from("profiles")
    .update({ active: nextActive, status: nextStatus })
    .eq("id", consultantId)
    .eq("status", consultant.status)
    .select("id")
    .maybeSingle();
  if (error || !updated) return;

  await admin.from("access_logs").insert({
    consultant_id: consultantId,
    event_type: nextActive ? "consultant_enabled" : "consultant_disabled",
    metadata: { changed_by: owner.id },
  });
  revalidatePath("/admin");
}

export async function deleteConsultantAction(formData: FormData) {
  const owner = await requireOwner();
  const consultantId = String(formData.get("consultant_id") ?? "");
  if (!consultantId || consultantId === owner.id) return;

  const admin = createAdminClient();
  const { data: consultant } = await admin
    .from("profiles")
    .select("id, role, email, full_name")
    .eq("id", consultantId)
    .maybeSingle();
  if (!consultant || consultant.role !== "consultant") return;

  // Fetch token IDs before cascade removes them
  const { data: tokens } = await admin
    .from("access_tokens")
    .select("id")
    .eq("consultant_id", consultantId);
  const tokenIds = (tokens ?? []).map((t: { id: string }) => t.id);

  // Delete logs tied to this consultant's tokens
  if (tokenIds.length > 0) {
    await admin.from("access_logs").delete().in("access_token_id", tokenIds);
  }
  // Delete logs tied to the consultant directly
  await admin.from("access_logs").delete().eq("consultant_id", consultantId);

  // Deleting the auth user cascades: auth.users → profiles → access_tokens
  await admin.auth.admin.deleteUser(consultantId);

  revalidatePath("/admin");
  revalidatePath("/consultor");
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

export async function sendPasswordRecoveryAction(formData: FormData) {
  const owner = await requireOwner();
  const consultantId = String(formData.get("consultant_id") ?? "");
  if (!consultantId || consultantId === owner.id) return;

  const admin = createAdminClient();
  const { data: consultant } = await admin
    .from("profiles")
    .select("id, role, email, status")
    .eq("id", consultantId)
    .maybeSingle();
  if (!consultant || consultant.role !== "consultant" || consultant.status === "deleted") return;

  const supabase = await createClient();
  const headersList = await headers();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? headersList.get("origin") ?? "";
  const redirectTo = origin
    ? `${origin}/auth/confirm?next=/login/reset-password`
    : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(consultant.email, { redirectTo });
  if (error) {
    console.error("[send_password_recovery_error]", error.message);
    return;
  }

  await admin.from("access_logs").insert({
    consultant_id: consultantId,
    event_type: "consultant_password_recovery_sent",
    metadata: { sent_by: owner.id, email: consultant.email },
  });
  revalidatePath("/admin");
}

export async function setTempPasswordAction(formData: FormData) {
  const owner = await requireOwner();
  const consultantId = String(formData.get("consultant_id") ?? "");
  const tempPassword = String(formData.get("temp_password") ?? "");
  if (!consultantId || consultantId === owner.id) return;
  if (tempPassword.length < 8) return;

  const admin = createAdminClient();
  const { data: consultant } = await admin
    .from("profiles")
    .select("id, role, status")
    .eq("id", consultantId)
    .maybeSingle();
  if (!consultant || consultant.role !== "consultant" || consultant.status === "deleted") return;

  const { error } = await admin.auth.admin.updateUserById(consultantId, {
    password: tempPassword,
  });
  if (error) {
    console.error("[set_temp_password_error]", error.message);
    return;
  }

  await admin.from("access_logs").insert({
    consultant_id: consultantId,
    event_type: "consultant_temp_password_set",
    metadata: { set_by: owner.id },
  });
  revalidatePath("/admin");
}
