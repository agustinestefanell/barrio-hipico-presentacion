import Link from "next/link";

const scenarios = [
  {
    number: "01",
    title: "Venta total",
    text: "Transferencia integral del activo como reserva territorial estratégica.",
  },
  {
    number: "02",
    title: "Venta parcial",
    text: "Estructuración por sectores según interés y oportunidad.",
  },
  {
    number: "03",
    title: "Estructura mixta",
    text: "Combinación a definir según estrategia de inversión.",
  },
];

export default function PoloLogisticoPage() {
  return (
    <main className="logistics-page">
      <header className="logistics-nav">
        <Link href="/" className="brand-mark dark-brand" aria-label="Volver a Barrio Hípico">
          <span>BH</span>
          <span className="brand-copy">
            Barrio Hípico
            <small>Línea complementaria</small>
          </span>
        </Link>
        <Link href="/" className="back-link">
          ← Volver a Barrio Hípico
        </Link>
      </header>

      <section className="logistics-hero">
        <div className="logistics-copy">
          <p className="eyebrow">Opción territorial separada</p>
          <h1>Terrenos para polo logístico</h1>
          <p className="logistics-lead">
            Una línea alternativa o complementaria, separada del relato principal de
            Barrio Hípico. No integra el masterplan residencial ecuestre.
          </p>
          <div className="logistics-facts">
            <div>
              <span>Superficie</span>
              <strong>25 ha</strong>
              <small>con anteproyecto adjunto</small>
            </div>
            <div>
              <span>Valor indicado</span>
              <strong>U$S 540.000</strong>
              <small>referencia provista</small>
            </div>
          </div>
        </div>
        <div className="logistics-map" aria-label="Diagrama conceptual de conectividad logística">
          <div className="log-grid" />
          <div className="log-corridor corridor-a"><span>Ruta 8</span></div>
          <div className="log-corridor corridor-b"><span>Ruta 101</span></div>
          <div className="log-corridor corridor-c"><span>Bypass</span></div>
          <div className="log-site">
            <span>25 ha</span>
            <strong>Polo logístico</strong>
          </div>
        </div>
      </section>

      <section className="logistics-detail">
        <div className="logistics-purpose">
          <p className="eyebrow light">Destino potencial</p>
          <h2>Polo logístico o reserva de tierra estratégica</h2>
          <p>
            Zona con presencia logística y conectividad con Ruta 8, Ruta 101 y Bypass.
            La oportunidad se analiza y estructura de manera independiente del masterplan
            residencial ecuestre.
          </p>
        </div>
        <div className="scenario-grid">
          {scenarios.map((scenario) => (
            <article key={scenario.number}>
              <span>{scenario.number}</span>
              <h3>{scenario.title}</h3>
              <p>{scenario.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="logistics-footer">
        <p>Una alternativa territorial. Un análisis separado.</p>
        <Link href="/" className="button button-primary">
          Volver a Barrio Hípico
        </Link>
      </footer>
    </main>
  );
}
