"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { clearViewerCookie } from "@/lib/auth/viewer-cookie";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await clearViewerCookie();
  redirect("/login");
}
