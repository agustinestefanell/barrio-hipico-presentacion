import Image from "next/image";
import SlideSection from "./SlideSection";

const planDocuments = [
  {
    number: "01",
    title: "Red ecuestre + estructura de lotes",
    description:
      "Lectura del barrio como sistema ecuestre: equinovías, estructura de lotes y movilidad interna pensada para cabalgar por todo el desarrollo.",
    image: "/images/territorio/Red ecuestre + estructura de lotes.jpg",
    width: 6209,
    height: 4335,
  },
  {
    number: "02",
    title: "Masterplan general",
    description:
      "Visión general del desarrollo, su estructura urbana representativa, acceso, áreas principales y organización del conjunto.",
    image: "/images/territorio/Masterplan general.png",
    width: 1191,
    height: 635,
  },
  {
    number: "03",
    title: "Un urbanismo diferente",
    description:
      "Una propuesta urbana donde la infraestructura ecuestre organiza paisaje, recorridos, experiencia cotidiana y diferenciación comercial.",
    image: "/images/territorio/Un urbanismo diferente.jpg",
    width: 2276,
    height: 1460,
  },
];

export default function Masterplan() {
  return (
    <SlideSection
      id="masterplan"
      eyebrow="Ordenamiento territorial"
      index="03"
      title="Masterplan representativo con lotes de 1.000 m²"
      intro="Una hipótesis preliminar donde lotes, vialidad y áreas comunes se organizan alrededor de una red interna de equinovías."
      tone="dark"
      className="masterplan"
    >
      <div className="masterplan-grid">
        <div className="plan-column">
          <div className="plan-real-image">
            <Image
              src="/plans/masterplan.png"
              alt="Masterplan representativo Barrio Hípico"
              width={1920}
              height={1080}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
        <aside className="format-panel">
          <p className="eyebrow light">Combinación posible de formatos</p>
          <div className="format-item">
            <span>01</span>
            <p>
              <strong>En nuestro terreno</strong>
              Núcleo principal de 1.000 m² combinado con algunos lotes de 500 m².
            </p>
          </div>
          <div className="format-item">
            <span>02</span>
            <p>
              <strong>En zonas gentrificables</strong>
              Formato mixto según tejido, oportunidad de compra e integración.
            </p>
          </div>
          <div className="format-item">
            <span>03</span>
            <p>
              <strong>En banco de tierra</strong>
              Chacras hípicas de 3 ha como “chacras en espera”.
            </p>
          </div>
        </aside>
      </div>
      <div className="plan-documents-heading">
        <div>
          <p className="eyebrow light">Lecturas territoriales</p>
          <h3>Planos de trabajo</h3>
        </div>
        <p>
          Documentos gráficos de referencia para leer el masterplan, la red ecuestre y
          una forma diferente de organizar el territorio.
        </p>
      </div>
      <div className="plan-documents">
        {planDocuments.map((plan) => (
          <article className="plan-document-card" key={plan.number}>
            <div className="plan-document-preview">
              <Image
                src={plan.image}
                alt={plan.title}
                className="plan-document-image"
                width={plan.width}
                height={plan.height}
                sizes="(max-width: 720px) 100vw, 24vw"
              />
              <span>{plan.number}</span>
            </div>
            <div className="plan-document-copy">
              <div className="plan-status is-available">
                <i aria-hidden="true" />
                Imagen disponible
              </div>
              <h4>{plan.title}</h4>
              <p>{plan.description}</p>
            </div>
          </article>
        ))}
        <article className="plan-document-card plan-location-card">
          <div className="plan-document-preview plan-map-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3923.395359573064!2d-55.992633681452645!3d-34.724943152032374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzTCsDQzJzMzLjUiUyA1NcKwNTknMzkuMSJX!5e1!3m2!1ses-419!2suy!4v1780934247693!5m2!1ses-419!2suy"
              title="Ubicación general del predio Barrio Hípico"
              className="plan-map"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span>04</span>
          </div>
          <div className="plan-document-copy">
            <div className="plan-status is-available">
              <i aria-hidden="true" />
              Mapa embebido
            </div>
            <h4>Ubicación</h4>
            <p>Ubicación general del predio y lectura de su entorno inmediato.</p>
          </div>
        </article>
      </div>
      <div className="masterplan-notes">
        <p>
          Los planos se presentan como documentos de trabajo y referencia. Su contenido
          puede ajustarse según estrategia comercial, aprobación normativa y etapa de
          desarrollo.
        </p>
        <p>El masterplan es representativo y no implica aprobación definitiva.</p>
      </div>
    </SlideSection>
  );
}
