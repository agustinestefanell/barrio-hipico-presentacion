import { existsSync } from "node:fs";
import { join } from "node:path";
import { housingModels } from "@/data/content";
import SlideSection from "./SlideSection";

function assetExists(image: string) {
  return existsSync(join(process.cwd(), "public", image.replace(/^\//, "")));
}

export default function Housing() {
  return (
    <SlideSection
      id="housing"
      eyebrow="Arquitectura + sistema constructivo"
      index="06"
      title="Housing: arquitectura de catálogo con identidad rural"
      intro="Casas de catálogo inspiradas en la tradición residencial anglosajona y norteamericana, adaptadas al contexto local con construcción ágil y altos estándares de calidad."
      tone="light"
      className="housing"
    >
      <div className="housing-intro">
        <div>
          <p>
            Barrio Hípico propone un sistema de Housing basado en casas de catálogo con
            identidad rural. Las tipologías base previamente estudiadas permiten una
            construcción ordenada, rápida y coherente con la imagen del conjunto.
          </p>
          <p>
            No se trata de diseñar cada casa desde cero, sino de trabajar con un catálogo
            semi-custom controlado, capaz de ordenar costos, acelerar obra y proteger la
            marca del barrio.
          </p>
          <p>
            Aleros generosos, galerías, porches y espacios semicubiertos son centrales:
            lugares para sentarse, mirar el paisaje, tomar mate, recibir visitas y vivir
            el exterior sin perder confort.
          </p>
        </div>
        <blockquote>
          El Housing no solo vende casas: construye la imagen del barrio, protege la marca
          y eleva el valor de los lotes restantes.
        </blockquote>
      </div>

      <div className="housing-benefits" aria-label="Beneficios del sistema Housing">
        <span>Catálogo semi-custom</span>
        <span>Aleros y galerías</span>
        <span>Relación con el exterior</span>
        <span>Obra más ágil</span>
        <span>Calidad y terminaciones</span>
        <span>Marca y valorización</span>
      </div>

      <div className="housing-gallery">
        {housingModels.map((model) => {
          const exists = assetExists(model.image);
          return (
            <article className={`housing-card ${exists ? "has-image" : "is-missing"}`} key={model.number}>
              <div
                className="housing-visual"
                style={{
                  backgroundImage: `url("${model.image}"), linear-gradient(135deg, rgba(184, 155, 100, 0.18), transparent 48%), repeating-linear-gradient(135deg, transparent 0 24px, rgba(21, 59, 49, 0.08) 24px 25px)`,
                }}
                aria-label={`Referencia visual: ${model.title}`}
              >
                <span>MODEL {model.number}</span>
                {!exists && <small>Imagen pendiente</small>}
              </div>
              <div className="housing-card-copy">
                <h3>{model.title}</h3>
                <p>{model.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </SlideSection>
  );
}
