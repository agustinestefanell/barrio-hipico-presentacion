import { getCurrentProfile } from "@/lib/auth/roles";
import RegistrationForm from "./RegistrationForm";

export default async function ConsultantRegistrationPage() {
  const profile = await getCurrentProfile();
  const isOwner = profile?.role === "owner";

  return (
    <main className="access-shell login-shell">
      <section className="access-card">
        <div className="access-brand" aria-hidden="true">
          <span>BH</span>
          <small>Barrio Hípico · Canelones</small>
        </div>
        <p className="eyebrow">Registro consultor</p>
        <h1>Solicitud de acceso consultor</h1>
        <p className="access-lead">
          Creá tu cuenta. El Owner deberá aprobarla antes de que puedas generar accesos.
        </p>

        <RegistrationForm isOwner={isOwner} />
      </section>
    </main>
  );
}
