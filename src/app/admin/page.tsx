import Link from "next/link";
import { logoutAction } from "@/app/auth-actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import CopyButton from "@/components/CopyButton";
import { requireOwner } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  approveConsultantAction,
  deleteConsultantAction,
  revokeAnyAccessAction,
  sendPasswordRecoveryAction,
  setConsultantStatusAction,
  setTempPasswordAction,
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

type ConsultantStatus = "pending" | "active" | "inactive" | "deleted";

function consultantStatus(consultant: { active: boolean; status?: string }): ConsultantStatus {
  if (["pending", "active", "inactive", "deleted"].includes(consultant.status ?? "")) {
    return consultant.status as ConsultantStatus;
  }
  return consultant.active ? "active" : "inactive";
}

function consultantStatusLabel(status: ConsultantStatus) {
  if (status === "pending") return "Pendiente";
  if (status === "active") return "Activo";
  if (status === "inactive") return "Inactivo";
  return "Borrado";
}

function buildConsultantDiagnostics(tokenRows: Array<{ consultant_id: string; active: boolean; revoked_at: string | null; expires_at: string }>) {
  const cutoff = new Date().getTime();
  const activeTokens = new Map<string, number>();
  const totalTokens = new Map<string, number>();
  for (const token of tokenRows) {
    totalTokens.set(token.consultant_id, (totalTokens.get(token.consultant_id) ?? 0) + 1);
    if (token.active && !token.revoked_at && new Date(token.expires_at).getTime() > cutoff) {
      activeTokens.set(token.consultant_id, (activeTokens.get(token.consultant_id) ?? 0) + 1);
    }
  }
  return { activeTokens, totalTokens };
}

export default async function AdminPage() {
  const owner = await requireOwner();
  const admin = createAdminClient();
  const [
    { data: profiles = [] },
    { data: consultantProfiles = [] },
    { data: tokens = [] },
    { data: logs = [] },
  ] =
    await Promise.all([
      admin.from("profiles").select("*").order("created_at", { ascending: false }),
      admin
        .from("profiles")
        .select("*")
        .eq("role", "consultant")
        .neq("id", owner.id)
        .order("created_at", { ascending: false }),
      admin.from("access_tokens").select("*").order("created_at", { ascending: false }),
      admin.from("access_logs").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

  const profileRows = profiles ?? [];
  const tokenRows = tokens ?? [];
  const logRows = logs ?? [];
  const profileNames = new Map(profileRows.map((profile) => [profile.id, profile.full_name || profile.email]));
  const tokenNames = new Map(tokenRows.map((token) => [token.id, token.viewer_name || "Invitado"]));

  // Diagnostics derived from existing data
  const { activeTokens: consultantActiveTokens, totalTokens: consultantTotalTokens } =
    buildConsultantDiagnostics(tokenRows);
  const consultantLastLog = new Map<string, string>();
  for (const log of logRows) {
    if (log.consultant_id && !consultantLastLog.has(log.consultant_id)) {
      consultantLastLog.set(log.consultant_id, log.event_type);
    }
  }

  const consultants = (consultantProfiles ?? []).filter(
    (profile) => consultantStatus(profile) !== "deleted",
  );
  const pendingConsultants = consultants.filter(
    (consultant) => consultantStatus(consultant) === "pending",
  ).length;

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
            <span>Puede aprobar, desactivar y borrar consultores</span>
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

      <section className="panel-card admin-card admin-card-wide">
        <div className="panel-card-heading">
          <span className="panel-card-index">01</span>
          <div>
            <h2>Consultores</h2>
            <p>
              Solicitudes pendientes y consultores delegados. Los consultores crean su cuenta y
              quedan pendientes hasta aprobación del Owner. Pendientes de aprobación:{" "}
              <strong>{pendingConsultants}</strong>.
            </p>
            <div className="consultant-registration-actions">
              <Link className="panel-button" href="/consultor/registro">
                Crear consultor
              </Link>
              <CopyButton
                label="Copiar link de registro de consultor"
                path="/consultor/registro"
              />
            </div>
          </div>
        </div>
        <div className="panel-table-wrap">
          <table className="panel-table admin-table consultant-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Creado</th>
                <th>Acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultants.length === 0 ? (
                <tr>
                  <td className="admin-empty" colSpan={6}>
                    <strong>Todavía no hay consultores registrados.</strong>
                    <span>Compartí el link de registro o usá Crear consultor para iniciar una solicitud.</span>
                  </td>
                </tr>
              ) : consultants.map((consultant) => {
                const status = consultantStatus(consultant);
                const activeCount = consultantActiveTokens.get(consultant.id) ?? 0;
                const totalCount = consultantTotalTokens.get(consultant.id) ?? 0;
                const lastLog = consultantLastLog.get(consultant.id);

                return (
                  <tr key={consultant.id}>
                    <td><strong>{consultant.full_name || "Sin nombre"}</strong></td>
                    <td>{consultant.email}</td>
                    <td>
                      <span className={`admin-badge is-${status}`}>
                        {consultantStatusLabel(status)}
                      </span>
                      <details className="consultant-diag">
                        <summary>Diagnóstico</summary>
                        <ul>
                          <li>role: {consultant.role}</li>
                          <li>status: {consultant.status ?? "—"}</li>
                          <li>active: {String(consultant.active)}</li>
                          <li>accesos activos: {activeCount}</li>
                          <li>accesos totales: {totalCount}</li>
                          <li>último evento: {lastLog ?? "sin logs"}</li>
                        </ul>
                      </details>
                    </td>
                    <td>{new Date(consultant.created_at).toLocaleDateString("es-UY")}</td>
                    <td>
                      <CopyButton
                        label="Copiar link del Panel Consultor"
                        path="/consultor"
                      />
                    </td>
                    <td>
                      <div className="consultant-actions">
                        {status === "pending" && (
                          <form action={approveConsultantAction}>
                            <input name="consultant_id" type="hidden" value={consultant.id} />
                            <button className="table-action is-approve" type="submit">Aprobar</button>
                          </form>
                        )}
                        {(status === "active" || status === "inactive") && (
                          <form action={setConsultantStatusAction}>
                            <input name="consultant_id" type="hidden" value={consultant.id} />
                            <input
                              name="next_status"
                              type="hidden"
                              value={status === "active" ? "inactive" : "active"}
                            />
                            <button className="table-action" type="submit">
                              {status === "active" ? "Desactivar" : "Reactivar"}
                            </button>
                          </form>
                        )}
                        <form action={sendPasswordRecoveryAction}>
                          <input name="consultant_id" type="hidden" value={consultant.id} />
                          <button className="table-action is-recovery" type="submit">
                            Enviar recuperación
                          </button>
                        </form>
                        <details className="temp-password-details">
                          <summary className="table-action">Contraseña temporal</summary>
                          <form action={setTempPasswordAction} className="temp-password-form">
                            <input name="consultant_id" type="hidden" value={consultant.id} />
                            <input
                              autoComplete="new-password"
                              className="temp-password-input"
                              minLength={8}
                              name="temp_password"
                              placeholder="Mín. 8 caracteres"
                              required
                              type="password"
                            />
                            <ConfirmSubmitButton
                              className="table-action is-approve"
                              message={`¿Confirmás que querés cambiar la contraseña de ${consultant.full_name || consultant.email}? Comunicásela por un canal seguro.`}
                            >
                              Confirmar
                            </ConfirmSubmitButton>
                          </form>
                        </details>
                        <form action={deleteConsultantAction}>
                          <input name="consultant_id" type="hidden" value={consultant.id} />
                          <ConfirmSubmitButton
                            className="table-action is-delete"
                            message="¿Seguro que querés borrar definitivamente este consultor? Se eliminarán su usuario, accesos y registros. Luego podrá registrarse de nuevo desde cero."
                          >
                            Borrar
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel-card admin-card admin-card-wide">
        <div className="panel-card-heading">
          <span className="panel-card-index">02</span>
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
          <span className="panel-card-index">03</span>
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
