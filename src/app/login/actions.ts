"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!hasSupabaseEnv()) {
    return { error: "El acceso privado todavía no fue configurado." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Ingresá email y contraseña." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { error: "Email o contraseña incorrectos." };
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || profile.status === "deleted") {
    await supabase.auth.signOut();
    return { error: "Esta cuenta ya no tiene acceso al sistema." };
  }

  if (profile.status === "pending") {
    await supabase.auth.signOut();
    return { error: "Tu cuenta está pendiente de aprobación del Owner." };
  }

  if (profile.status === "inactive" || (!profile.active && profile.status !== "active")) {
    await supabase.auth.signOut();
    return { error: "Tu cuenta está desactivada. Contactá al Owner." };
  }

  if (profile.role === "owner" && profile.active && (!profile.status || profile.status === "active")) {
    redirect("/admin");
  }

  redirect("/consultor");
}
