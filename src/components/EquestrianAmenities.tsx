import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { equestrianAmenities } from "@/data/content";
import SlideSection from "./SlideSection";

function assetExists(image: string) {
  return existsSync(join(process.cwd(), "public", image.replace(/^\//, "")));
}

export default function EquestrianAmenities() {
  return (
    <SlideSection
      id="amenities"
      eyebrow="Vida ecuestre cotidiana"
      index="03A"
      title="Concepto hípico y amenities"
      intro="La experiencia ecuestre no aparece como un servicio aislado, sino como una infraestructura cotidiana: caminos, equinovías, caballerizas, clubhouse, tiendas especializadas y espacios sociales pensados alrededor del caballo."
      tone="light"
      className="equestrian-amenities"
    >
      <div className="amenities-statement">
        <span>Infraestructura + paisaje + comunidad</span>
        <strong>El caballo organiza la experiencia de vivir y recorrer el barrio.</strong>
      </div>
      <div className="amenities-gallery">
        {equestrianAmenities.map((item) => {
          const exists = assetExists(item.image);
          return (
            <article
              className={`amenity-card ${exists ? "has-image" : "is-missing"}`}
              key={item.number}
            >
              <div className="amenity-image-wrap">
                {exists ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="amenity-image"
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                ) : (
                  <span className="amenity-placeholder">Imagen pendiente</span>
                )}
              </div>
              <div className="amenity-card-body">
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </SlideSection>
  );
}
