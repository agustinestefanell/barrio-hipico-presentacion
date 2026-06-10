"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";

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
    .select("id, role, status, email, full_name")
    .eq("id", consultantId)
    .maybeSingle();
  if (!consultant || consultant.role !== "consultant" || consultant.status === "deleted") return;

  const { data: activeTokens, error: tokenReadError } = await admin
    .from("access_tokens")
    .select("id")
    .eq("consultant_id", consultantId)
    .eq("active", true);
  if (tokenReadError) return;

  if ((activeTokens ?? []).length > 0) {
    const { error: revokeError } = await admin
      .from("access_tokens")
      .update({ active: false, revoked_at: new Date().toISOString() })
      .eq("consultant_id", consultantId)
      .eq("active", true);
    if (revokeError) return;
  }

  const { data: deletedProfile, error: profileError } = await admin
    .from("profiles")
    .update({ active: false, status: "deleted" })
    .eq("id", consultantId)
    .neq("status", "deleted")
    .select("id")
    .maybeSingle();
  if (profileError || !deletedProfile) return;

  await admin.from("access_logs").insert({
    consultant_id: consultantId,
    event_type: "consultant_deleted",
    metadata: {
      deleted_by: owner.id,
      email: consultant.email,
      full_name: consultant.full_name,
      revoked_accesses: (activeTokens ?? []).length,
    },
  });
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
