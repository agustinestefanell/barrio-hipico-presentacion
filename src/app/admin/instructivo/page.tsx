import Link from "next/link";
import { requireOwner } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function OwnerGuidePage() {
  await requireOwner();

  return (
    <main className="panel-shell admin-shell guide-shell">
      <header className="panel-header admin-header guide-header">
        <div className="panel-heading">
          <p className="eyebrow">Instructivo interno</p>
          <h1>Owner · Consultor · Visitante</h1>
          <p className="panel-subtitle">
            Guía operativa para administrar accesos privados a la presentación Barrio Hípico.
          </p>
        </div>
        <nav>
          <Link className="admin-button-secondary" href="/admin">Volver al Owner Admin</Link>
        </nav>
      </header>

      <article className="panel-card admin-card guide-document">
        <header className="guide-intro">
          <span>Documento operativo</span>
          <h2>Instructivo de uso — Presentación privada Barrio Hípico</h2>
          <p>
            Roles, procedimientos y buenas prácticas para gestionar el acceso confidencial
            a la presentación.
          </p>
        </header>

        <nav className="guide-index" aria-label="Índice del instructivo">
          <a href="#owner"><span>01</span>Panel Owner</a>
          <a href="#consultores"><span>02</span>Consultores inmobiliarios</a>
          <a href="#visitantes"><span>03</span>Inversores / visitantes</a>
        </nav>

        <section className="guide-section" id="owner">
          <div className="guide-section-heading">
            <span>01</span>
            <div>
              <p>Control máximo</p>
              <h2>Dueño de la página / Panel Owner</h2>
            </div>
          </div>
          <p>El Dueño de la página tiene el control máximo del sistema.</p>

          <h3>Acceso</h3>
          <p>Entrar a <code>/login</code>, ingresar con el usuario Owner autorizado y luego acceder a <code>/admin</code>.</p>

          <h3>Qué puede hacer el Owner</h3>
          <ul>
            <li>Ver la presentación.</li>
            <li>Crear consultores.</li>
            <li>Activar o desactivar consultores.</li>
            <li>Ver todos los accesos generados.</li>
            <li>Revocar cualquier acceso.</li>
            <li>Ver logs básicos de actividad.</li>
            <li>Controlar qué consultor generó cada acceso.</li>
          </ul>

          <h3>Crear un consultor</h3>
          <ol>
            <li>Desde <code>/admin</code>, ir a la sección <strong>Crear consultor</strong>.</li>
            <li>Ingresar nombre del consultor, email y contraseña temporal.</li>
            <li>Presionar <strong>Crear consultor</strong>.</li>
            <li>Comunicar al consultor el link de acceso, email y contraseña temporal.</li>
          </ol>
          <p className="guide-note">El consultor no recibe poderes de Owner. Solo puede generar accesos para terceros.</p>

          <h3>Revocar accesos</h3>
          <p>Desde <code>/admin</code>, el Owner puede revocar cualquier acceso creado por cualquier consultor.</p>
          <ul>
            <li>Cuando el inversor ya no debe tener acceso.</li>
            <li>Si el link fue reenviado indebidamente.</li>
            <li>Cuando venció la negociación.</li>
            <li>Ante sospecha de uso no autorizado.</li>
            <li>Para cortar el acceso antes del vencimiento.</li>
          </ul>

          <h3>Buenas prácticas del Owner</h3>
          <ul>
            <li>No compartir el usuario Owner.</li>
            <li>No usar el mismo email para Owner y consultores.</li>
            <li>Revisar periódicamente los accesos activos.</li>
            <li>Revocar accesos que ya no correspondan.</li>
            <li>Usar contraseñas temporales seguras para consultores.</li>
            <li>No enviar claves sensibles por canales inseguros si no es necesario.</li>
            <li>No subir ni compartir archivos <code>.env.local</code>.</li>
          </ul>
        </section>

        <section className="guide-section" id="consultores">
          <div className="guide-section-heading">
            <span>02</span>
            <div>
              <p>Gestión delegada</p>
              <h2>Consultores inmobiliarios</h2>
            </div>
          </div>
          <p>
            El consultor tiene un panel delegado. Puede generar accesos para inversores o
            terceros, pero no controla la página ni puede ver funciones del Owner.
          </p>

          <h3>Acceso</h3>
          <p>Entrar a <code>/login</code> con el email asignado por el Owner y la contraseña temporal. Luego acceder a <code>/consultor</code>.</p>

          <h3>Qué puede hacer el consultor</h3>
          <ul>
            <li>Ver la presentación.</li>
            <li>Generar links privados de acceso y PINs de 4 dígitos.</li>
            <li>Definir vencimiento y cantidad máxima de usos.</li>
            <li>Ver y revocar los accesos que él mismo generó.</li>
          </ul>

          <h3>Qué no puede hacer</h3>
          <ul>
            <li>Entrar al Panel Owner o crear otros consultores.</li>
            <li>Ver accesos generados por otros consultores.</li>
            <li>Modificar la presentación o cambiar configuraciones generales.</li>
          </ul>

          <h3>Crear acceso para un inversor</h3>
          <ol>
            <li>Desde <code>/consultor</code>, ir a <strong>Crear acceso</strong>.</li>
            <li>Ingresar nombre o alias, email opcional, vencimiento y cantidad máxima de usos.</li>
            <li>Presionar <strong>Generar acceso</strong>.</li>
            <li>Copiar el link único y el PIN de 4 dígitos antes de cerrar la tarjeta.</li>
          </ol>

          <h3>Cómo enviar el acceso al inversor</h3>
          <p>Enviar el link único, el PIN y una aclaración de que el acceso es privado, personal y no debe reenviarse.</p>
          <blockquote>
            Te comparto el acceso privado a la presentación de Barrio Hípico.
            <br /><br />
            Link: [pegar link]
            <br />
            PIN: [pegar PIN]
            <br /><br />
            El acceso es personal y temporal. Por favor no reenviarlo.
          </blockquote>

          <h3>Buenas prácticas del consultor</h3>
          <ul>
            <li>Generar un acceso por cada inversor.</li>
            <li>No reutilizar el mismo link para varias personas ni publicarlo en grupos.</li>
            <li>No reenviar el PIN separado de contexto.</li>
            <li>Revocar accesos que ya no correspondan.</li>
            <li>Avisar al Owner ante cualquier uso sospechoso.</li>
          </ul>
        </section>

        <section className="guide-section" id="visitantes">
          <div className="guide-section-heading">
            <span>03</span>
            <div>
              <p>Acceso temporal</p>
              <h2>Inversores / visitantes que reciben PIN</h2>
            </div>
          </div>
          <p>El inversor o visitante recibe un acceso privado para ver la presentación.</p>

          <h3>Qué recibe</h3>
          <ul>
            <li>Un link único, por ejemplo: <code>https://.../access/abc123</code>.</li>
            <li>Un PIN de 4 dígitos, por ejemplo: <code>4827</code>.</li>
          </ul>

          <h3>Cómo ingresar</h3>
          <ol>
            <li>Abrir el link recibido.</li>
            <li>Ingresar el PIN de 4 dígitos.</li>
            <li>Presionar <strong>Ingresar</strong>.</li>
            <li>Si el acceso está vigente, se abrirá la presentación.</li>
          </ol>

          <h3>Condiciones del acceso</h3>
          <ul>
            <li>Puede tener vencimiento y cantidad máxima de usos.</li>
            <li>Puede bloquearse por intentos incorrectos.</li>
            <li>Puede revocarse manualmente por el Owner o el consultor.</li>
          </ul>

          <h3>Qué no puede hacer el visitante</h3>
          <ul>
            <li>Entrar al panel Owner o al panel Consultor.</li>
            <li>Generar accesos, modificar información, ver logs o administrar usuarios.</li>
          </ul>

          <h3>Buenas prácticas para el visitante</h3>
          <ul>
            <li>No reenviar el link ni el PIN.</li>
            <li>Usar el acceso solo para evaluación privada.</li>
            <li>Contactar al consultor si el PIN venció o no funciona.</li>
            <li>No intentar múltiples PINs incorrectos, porque el acceso puede bloquearse.</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
