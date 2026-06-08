import { landBankItems } from "@/data/content";
import SlideSection from "./SlideSection";

export default function LandBank() {
  return (
    <SlideSection
      id="banco-tierra"
      eyebrow="Estrategia territorial"
      index="07"
      title="Chacras hípicas en espera"
      intro="No se plantea como una venta simple: requiere una estructura jurídica específica y contempla más de un escenario."
      tone="light"
      className="land-bank"
    >
      <div className="land-layout">
        <div className="land-figure">
          <span className="land-size">≈ 3 ha</span>
          <span className="land-line line-one" />
          <span className="land-line line-two" />
          <span className="land-line line-three" />
          <p>Uso ecuestre actual</p>
          <strong>Potencial de integración futura</strong>
        </div>
        <div className="land-content">
          <p className="land-copy">
            Determinados sectores pueden sostener un uso ecuestre actual mientras se
            tramitan aprobaciones futuras, con expectativa de integración al proyecto
            general y una alternativa prevista si esa aprobación no se obtiene.
          </p>
          <div className="land-steps">
            {landBankItems.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
          <p className="legal-note">Modelo sujeto a instrumentación jurídica específica.</p>
        </div>
      </div>
    </SlideSection>
  );
}
