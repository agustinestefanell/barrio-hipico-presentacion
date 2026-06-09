import Link from "next/link";
import { requireConsultantOrOwner } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function ConsultantGuidePage() {
  await requireConsultantOrOwner();

  return (
    <main className="panel-shell consultant-shell guide-shell">
      <header className="panel-header admin-header guide-header">
        <div className="panel-heading">
          <p className="eyebrow">INSTRUCTIVO CONSULTOR</p>
          <h1>Cómo generar y enviar accesos a inversores</h1>
          <p className="panel-subtitle">
            Guía rápida para crear links privados con PIN de 4 dígitos y compartirlos correctamente.
          </p>
        </div>
        <nav>
          <Link className="admin-button-secondary" href="/consultor">
            Volver al Panel Consultor
          </Link>
        </nav>
      </header>

      <article className="panel-card admin-card guide-document">
        <section className="guide-section">
          <div className="guide-section-heading">
            <span>01</span>
            <div>
              <p>Preparar la invitación</p>
              <h2>Crear un acceso</h2>
            </div>
          </div>
          <p>
            Desde el Panel Consultor, ir a <strong>Crear acceso</strong> y completar los datos
            del inversor o visitante.
          </p>
          <ul>
            <li>Nombre o alias del inversor.</li>
            <li>Email, si corresponde.</li>
            <li>Vencimiento del acceso.</li>
            <li>Cantidad máxima de usos.</li>
          </ul>
        </section>

        <section className="guide-section">
          <div className="guide-section-heading">
            <span>02</span>
            <div>
              <p>Guardar los datos</p>
              <h2>Copiar link y PIN</h2>
            </div>
          </div>
          <p>
            Al generar el acceso, el sistema muestra un link único y un PIN de 4 dígitos.
          </p>
          <p className="guide-note">
            <strong>Importante:</strong> el PIN se muestra una sola vez. Copialo antes de
            cerrar la tarjeta.
          </p>
        </section>

        <section className="guide-section">
          <div className="guide-section-heading">
            <span>03</span>
            <div>
              <p>Compartir de forma segura</p>
              <h2>Enviar al inversor</h2>
            </div>
          </div>
          <p>
            Enviá el link y el PIN directamente al inversor e indicá que el acceso es personal
            y temporal.
          </p>
          <blockquote>
            Te comparto el acceso privado a la presentación de Barrio Hípico.
            <br /><br />
            Link: [pegar link]
            <br />
            PIN: [pegar PIN]
            <br /><br />
            El acceso es personal y temporal. Por favor no reenviarlo.
          </blockquote>
        </section>

        <section className="guide-section">
          <div className="guide-section-heading">
            <span>04</span>
            <div>
              <p>Cerrar permisos</p>
              <h2>Revocar acceso</h2>
            </div>
          </div>
          <p>
            Si el acceso ya no corresponde, fue reenviado indebidamente o la instancia comercial
            terminó, revocalo desde la tabla de accesos generados.
          </p>
        </section>

        <section className="guide-section">
          <div className="guide-section-heading">
            <span>05</span>
            <div>
              <p>Operación responsable</p>
              <h2>Buenas prácticas</h2>
            </div>
          </div>
          <ul>
            <li>Crear un acceso por cada inversor.</li>
            <li>No reutilizar el mismo link para varias personas.</li>
            <li>No enviar PINs en grupos abiertos.</li>
            <li>Revocar accesos vencidos o innecesarios.</li>
            <li>Avisar al Owner ante cualquier uso sospechoso.</li>
          </ul>
        </section>

        <Link className="panel-button guide-return-link" href="/consultor">
          Volver al Panel Consultor
        </Link>
      </article>
    </main>
  );
}
