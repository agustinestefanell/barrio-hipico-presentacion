import { architectureBoxes, architecturePrinciples } from "@/data/content";
import SlideSection from "./SlideSection";

export default function ArchitectureBrand() {
  return (
    <SlideSection
      id="arquitectura"
      eyebrow="Identidad construida"
      index="06"
      title="Arquitectura ecuestre contemporánea"
      intro="El lenguaje arquitectónico define una identidad reconocible; Housing convierte esa identidad en un sistema constructivo y comercial."
      tone="dark"
      className="architecture"
    >
      <div className="architecture-system">
        <div className="architecture-narrative">
          <p className="eyebrow light">Lenguaje e identidad</p>
          <p>
            La arquitectura de Barrio Hípico se plantea bajo un modelo semi-custom: un
            catálogo controlado de viviendas inspiradas en estilos Modern Farmhouse,
            Country Equestrian y Ranch-Craftsman.
          </p>
          <p>
            Esta sección define el carácter visual del conjunto. La sección Housing
            presenta cómo ese lenguaje se convierte en modelos base repetibles,
            adaptables y comercialmente viables.
          </p>
          <blockquote>
            La vivienda no es solo producto final: es el instrumento principal para
            construir marca, controlar estética y capturar valorización.
          </blockquote>
        </div>
        <div className="architecture-principles">
          {architecturePrinciples.map((item, index) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </div>
          ))}
          <p className="architecture-note">
            Los estilos y modelos ilustran una dirección conceptual. Las tipologías
            definitivas todavía no están definidas.
          </p>
        </div>
      </div>

      <div className="architecture-catalogue-heading">
        <div>
          <p className="eyebrow light">Referencias de lenguaje · 6 espacios reservados</p>
          <h3>Una identidad arquitectónica, distintas expresiones</h3>
        </div>
        <p>
          Barndominium se reserva para amenities, clubhouse, caballerizas, talleres o
          unidades específicas; no como estética dominante del barrio.
        </p>
      </div>

      <div className="architecture-boxes">
        {architectureBoxes.map((box) => (
          <article className="architecture-box" key={box.number}>
            <div
              className="architecture-image"
              style={{
                backgroundImage: `url("${box.image}"), linear-gradient(135deg, rgba(184, 155, 100, 0.18), transparent 48%), repeating-linear-gradient(135deg, transparent 0 24px, rgba(21, 59, 49, 0.08) 24px 25px)`,
              }}
              aria-label={`Espacio reservado para imagen de ${box.title}`}
            >
              <span className="architecture-box-number">BOX {box.number}</span>
              <span className="architecture-image-status">
                Espacio para imagen propia
              </span>
              <span className="architecture-route">{box.image}</span>
            </div>
            <div className="architecture-box-copy">
              <p>{box.use}</p>
              <h4>{box.title}</h4>
              <span>{box.description}</span>
            </div>
          </article>
        ))}
      </div>
    </SlideSection>
  );
}
