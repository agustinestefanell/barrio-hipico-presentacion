import Link from "next/link";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const configured = hasSupabaseEnv();

  return (
    <main className="access-shell login-shell">
      <section className="access-card">
        <div className="access-brand" aria-hidden="true">
          <span>BH</span>
          <small>Barrio Hípico · Canelones</small>
        </div>
        <p className="eyebrow">Área confidencial</p>
        <h1>Acceso privado</h1>
        <p className="access-lead">Ingresá con tus credenciales autorizadas.</p>
        {!configured && (
          <p className="setup-notice">
            Supabase todavía no está configurado. Cargá las variables de entorno y ejecutá
            la migración antes de ingresar.
          </p>
        )}
        <LoginForm />
        <div className="consultant-registration-link">
          <Link href="/consultor/registro">Soy consultor y necesito solicitar acceso</Link>
          <small>El registro de consultores requiere aprobación del Owner.</small>
        </div>
        <p className="access-help">
          Los invitados deben utilizar el link único recibido junto con su PIN.
        </p>
      </section>
    </main>
  );
}
