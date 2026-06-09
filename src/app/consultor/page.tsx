import Link from "next/link";
import { logoutAction } from "@/app/auth-actions";
import { requireConsultantOrOwner } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import CreateAccessForm from "./CreateAccessForm";
import { revokeOwnAccessAction } from "./actions";

export const dynamic = "force-dynamic";

function tokenStatus(token: {
  active: boolean;
  revoked_at: string | null;
  expires_at: string;
  used_count: number;
  max_uses: number;
}) {
  if (!token.active || token.revoked_at) return "Revocado";
  if (new Date(token.expires_at).getTime() <= Date.now()) return "Vencido";
  if (token.used_count >= token.max_uses) return "Agotado";
  return "Activo";
}

function statusClass(status: string) {
  return `admin-badge is-${status.toLowerCase()}`;
}

export default async function ConsultantPage() {
  const profile = await requireConsultantOrOwner();
  const admin = createAdminClient();
  const query = admin.from("access_tokens").select("*").order("created_at", { ascending: false });
  const { data: tokens = [] } =
    profile.role === "owner" ? await query : await query.eq("consultant_id", profile.id);
  const tokenRows = tokens ?? [];
  const consultantName =
    profile.role === "consultant" ? profile.full_name || profile.email : "Acceso operativo";

  return (
    <main className="panel-shell consultant-shell">
      <header className="panel-header admin-header">
        <div className="panel-heading">
          <p className="eyebrow">Consultor</p>
          <h1>Panel Consultor</h1>
          <p className="panel-role-label">Panel de un consultor creado por el dueño</p>
          <Link className="panel-guide-primary" href="/consultor/instructivo">
            INSTRUCTIVO: Cómo generar y enviar accesos a inversores
          </Link>
          <p className="panel-subtitle">
            Gestión de accesos privados mediante link único y PIN de 4 dígitos.
          </p>
          <div className="panel-capabilities is-consultant" aria-label="Capacidades del Panel Consultor">
            <span>Puede agregar y revocar PINs</span>
            <span>Puede ver los accesos activos que él mismo generó</span>
          </div>
        </div>
        <div className="panel-header-side">
          <div className="panel-user">
            <span>Consultor activo</span>
            <strong>{consultantName}</strong>
          </div>
          <nav>
            <Link className="admin-button-secondary" href="/">Ver presentación</Link>
            <form action={logoutAction}>
              <button className="admin-button-secondary" type="submit">Cerrar sesión</button>
            </form>
          </nav>
        </div>
      </header>

      <section className="panel-card admin-card">
        <div className="panel-card-heading">
          <span className="panel-card-index">01</span>
          <div>
            <h2>Crear acceso invitado</h2>
            <p>Definí vigencia y usos para compartir una invitación controlada.</p>
          </div>
        </div>
        <CreateAccessForm />
      </section>

      <section className="panel-card admin-card">
        <div className="panel-card-heading">
          <span className="panel-card-index">02</span>
          <div>
            <h2>Accesos propios</h2>
            <p>Links emitidos, vigencia, consumo y estado de cada invitación.</p>
          </div>
        </div>
        <div className="panel-table-wrap">
          <table className="panel-table admin-table">
            <thead>
              <tr><th>Invitado</th><th>Link</th><th>Estado</th><th>Vencimiento</th><th>Usos</th><th>Intentos</th><th /></tr>
            </thead>
            <tbody>
              {tokenRows.length === 0 ? (
                <tr><td className="admin-empty" colSpan={7}>Todavía no se generaron accesos.</td></tr>
              ) : tokenRows.map((token) => (
                <tr key={token.id}>
                  <td><strong>{token.viewer_name || "Sin nombre"}</strong><small>{token.viewer_email}</small></td>
                  <td><code className="admin-link-code">/access/{token.slug}</code></td>
                  <td><span className={statusClass(tokenStatus(token))}>{tokenStatus(token)}</span></td>
                  <td>{new Date(token.expires_at).toLocaleDateString("es-UY")}</td>
                  <td>{token.used_count}/{token.max_uses}</td>
                  <td>{token.failed_attempts}</td>
                  <td>
                    {tokenStatus(token) === "Activo" && (
                      <form action={revokeOwnAccessAction}>
                        <input name="token_id" type="hidden" value={token.id} />
                        <button className="table-action" type="submit">Revocar</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
