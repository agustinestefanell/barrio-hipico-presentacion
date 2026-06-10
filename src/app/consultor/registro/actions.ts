"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export type ConsultantRegistrationState = {
  error: string;
  success: boolean;
};

export async function registerConsultantAction(
  _previousState: ConsultantRegistrationState,
  formData: FormData,
): Promise<ConsultantRegistrationState> {
  if (!hasSupabaseEnv()) {
    return { error: "El registro todavía no fue configurado.", success: false };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

  if (!fullName || !email || !password || !passwordConfirmation) {
    return { error: "Completá todos los campos.", success: false };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres.", success: false };
  }
  if (password !== passwordConfirmation) {
    return { error: "Las contraseñas no coinciden.", success: false };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    return {
      error: "No se pudo enviar la solicitud. Revisá los datos e intentá nuevamente.",
      success: false,
    };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: data.user.id,
    email,
    full_name: fullName,
    role: "consultant",
    active: false,
    status: "pending",
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: "No se pudo enviar la solicitud. Intentá nuevamente.", success: false };
  }

  await admin.from("access_logs").insert({
    consultant_id: data.user.id,
    event_type: "consultant_registered",
    metadata: { email, full_name: fullName },
  });

  return { error: "", success: true };
}
