"use server";

import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export type ResetPasswordState = {
  error: string;
  success: boolean;
};

export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  if (!hasSupabaseEnv()) {
    return { error: "El sistema todavía no está configurado.", success: false };
  }

  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("password_confirmation") ?? "");

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres.", success: false };
  }
  if (password !== confirmation) {
    return { error: "Las contraseñas no coinciden.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("[reset_password_error]", error.message);
    const msg = error.message ?? "";
    if (msg.includes("session") || msg.includes("token") || msg.includes("expired")) {
      return { error: "El link de recuperación expiró. Pedile al Owner que envíe uno nuevo.", success: false };
    }
    return { error: "No se pudo actualizar la contraseña. Intentá nuevamente.", success: false };
  }

  await supabase.auth.signOut();
  return { error: "", success: true };
}

export async function requestPasswordRecoveryAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  if (!hasSupabaseEnv()) {
    return { error: "El sistema todavía no está configurado.", success: false };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "Ingresá tu email.", success: false };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const redirectTo = siteUrl
    ? `${siteUrl}/auth/confirm?next=/login/reset-password`
    : undefined;

  await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  return { error: "", success: true };
}
