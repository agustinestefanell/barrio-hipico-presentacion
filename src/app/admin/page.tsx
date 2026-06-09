import Link from "next/link";
import { logoutAction } from "@/app/auth-actions";
import CopyButton from "@/components/CopyButton";
import PasswordField from "@/components/PasswordField";
import { requireOwner } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createConsultantAction,
  revokeAnyAccessAction,
  toggleConsultantAction,
} from "./actions";

export const dynamic = "force-dynamic";

function accessStatus(token: {
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

export default async function AdminPage() {
  const owner = await requireOwner();
  const admin = createAdminClient();
  const [{ data: profiles = [] }, { data: tokens = [] }, { data: logs = [] }] =
    await Promise.all([
      admin.from("profiles").select("*").order("created_at", { ascending: false }),
      admin.from("access_tokens").select("*").order("created_at", { ascending: false }),
      admin.from("access_logs").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

  const profileRows = profiles ?? [];
  const tokenRows = tokens ?? [];
  const logRows = logs ?? [];
  const profileNames = new Map(profileRows.map((profile) => [profile.id, profile.full_name || profile.email]));
  const tokenNames = new Map(tokenRows.map((token) => [token.id, token.viewer_name || "Invitado"]));
  const consultants = profileRows.filter((profile) => profile.role === "consultant");

  return (
    <main className="panel-shell admin-shell">
      <header className="panel-header admin-header">
        <div className="panel-heading">
          <p className="eyebrow">Owner</p>
          <h1>Panel Owner</h1>
          <p className="panel-role-label">Panel del dueño</p>
          <Link className="panel-guide-primary" href="/admin/instructivo">
            INSTRUCTIVO: Owner-Consultor-Visitante
          </Link>
          <p className="panel-subtitle">
            Control general de consultores, accesos privados y actividad del sistema.
          </p>
          <div className="panel-capabilities" aria-label="Capacidades del Panel Owner">
            <span>Puede agregar y revocar consultores</span>
            <span>Puede agregar y revocar PINs</span>
            <span>Puede ver accesos activos globales</span>
          </div>
        </div>
        <div className="panel-header-side">
          <div className="panel-user">
            <span>Sesión activa</span>
            <strong>{owner.full_name || owner.email}</strong>
          </div>
          <nav>
            <Link className="admin-button-secondary" href="/">Ver presentación</Link>
            <Link href="/consultor">Generar acceso</Link>
            <form action={logoutAction}>
              <button className="admin-button-secondary" type="submit">Cerrar sesión</button>
            </form>
          </nav>
        </div>
      </header>

      <div className="admin-grid">
        <section className="panel-card admin-card">
          <div className="panel-card-heading">
            <span className="panel-card-index">01</span>
            <div>
              <h2>Crear consultor</h2>
              <p>Generá un usuario delegado para emitir accesos privados.</p>
            </div>
          </div>
          <form action={createConsultantAction} className="panel-form admin-form-stacked">
            <label>Nombre<input name="full_name" required /></label>
            <label>Email<input name="email" type="email" required /></label>
            <PasswordField
              autoComplete="new-password"
              label="Contraseña temporal"
              minLength={8}
              name="password"
              required
            />
            <button className="panel-button" type="submit">Crear consultor</button>
          </form>
        </section>

        <section className="panel-card admin-card">
          <div className="panel-card-heading">
            <span className="panel-card-index">02</span>
            <div>
              <h2>Consultores</h2>
              <p>Usuarios delegados habilitados para generar invitaciones.</p>
            </div>
          </div>
          <div className="panel-table-wrap">
            <table className="panel-table admin-table">
              <thead><tr><th>Nombre</th><th>Email</th><th>Estado</th><th>Creado</th><th>Acceso</th><th /></tr></thead>
              <tbody>
                {consultants.length === 0 ? (
                  <tr><td className="admin-empty" colSpan={6}>Todavía no hay consultores creados.</td></tr>
                ) : consultants.map((consultant) => (
                  <tr key={consultant.id}>
                    <td><strong>{consultant.full_name || "Sin nombre"}</strong></td>
                    <td>{consultant.email}</td>
                    <td>
                      <span className={consultant.active ? "admin-badge is-activo" : "admin-badge is-inactivo"}>
                        {consultant.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>{new Date(consultant.created_at).toLocaleDateString("es-UY")}</td>
                    <td>
                      <CopyButton
                        label="Copiar link del Panel Consultor"
                        path="/consultor"
                      />
                    </td>
                    <td>
                      <form action={toggleConsultantAction}>
                        <input name="consultant_id" type="hidden" value={consultant.id} />
                        <input name="next_active" type="hidden" value={String(!consultant.active)} />
                        <button className="table-action" type="submit">
                          {consultant.active ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel-card admin-card admin-card-wide">
        <div className="panel-card-heading">
          <span className="panel-card-index">03</span>
          <div>
            <h2>Todos los accesos</h2>
            <p>Estado global de las invitaciones emitidas por el equipo.</p>
          </div>
        </div>
        <div className="panel-table-wrap">
          <table className="panel-table admin-table">
            <thead><tr><th>Consultor</th><th>Invitado</th><th>Link</th><th>Estado</th><th>Vencimiento</th><th>Usos</th><th>Intentos</th><th /></tr></thead>
            <tbody>
              {tokenRows.length === 0 ? (
                <tr><td className="admin-empty" colSpan={8}>Todavía no se generaron accesos.</td></tr>
              ) : tokenRows.map((token) => (
                <tr key={token.id}>
                  <td>{profileNames.get(token.consultant_id) || "Sin perfil"}</td>
                  <td><strong>{token.viewer_name || "Sin nombre"}</strong><small>{token.viewer_email}</small></td>
                  <td><code className="admin-link-code">/access/{token.slug}</code></td>
                  <td><span className={statusClass(accessStatus(token))}>{accessStatus(token)}</span></td>
                  <td>{new Date(token.expires_at).toLocaleDateString("es-UY")}</td>
                  <td>{token.used_count}/{token.max_uses}</td>
                  <td>{token.failed_attempts}</td>
                  <td>
                    {accessStatus(token) === "Activo" && (
                      <form action={revokeAnyAccessAction}>
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

      <section className="panel-card admin-card admin-card-wide">
        <div className="panel-card-heading">
          <span className="panel-card-index">04</span>
          <div>
            <h2>Logs recientes</h2>
            <p>Últimos eventos relevantes del sistema de acceso privado.</p>
          </div>
        </div>
        <div className="panel-table-wrap">
          <table className="panel-table admin-table">
            <thead><tr><th>Evento</th><th>Consultor</th><th>Invitado</th><th>Fecha</th><th>Metadata</th></tr></thead>
            <tbody>
              {logRows.length === 0 ? (
                <tr><td className="admin-empty" colSpan={5}>Sin actividad registrada todavía.</td></tr>
              ) : logRows.map((log) => (
                <tr key={log.id}>
                  <td><span className="admin-event">{log.event_type}</span></td>
                  <td>{log.consultant_id ? profileNames.get(log.consultant_id) || "Sin perfil" : "—"}</td>
                  <td>{log.access_token_id ? tokenNames.get(log.access_token_id) || "Acceso eliminado" : "—"}</td>
                  <td>{new Date(log.created_at).toLocaleString("es-UY")}</td>
                  <td><code>{log.metadata ? JSON.stringify(log.metadata) : "—"}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
