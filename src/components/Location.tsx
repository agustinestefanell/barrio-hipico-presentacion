import Image from "next/image";
import { locationItems } from "@/data/content";
import SlideSection from "./SlideSection";

export default function Location() {
  return (
    <SlideSection
      id="ubicacion"
      eyebrow="Conectividad"
      index="08"
      title="Ubicación estratégica"
      intro="Un enclave de Canelones conectado con los principales corredores metropolitanos y destinos de referencia."
      tone="light"
      className="location"
    >
      <div className="location-layout">
        <div className="location-plan-primary">
          <Image
            src="/images/territorio/Masterplan general 2.png"
            alt="Plano principal de ubicación estratégica de Barrio Hípico"
            className="location-plan-primary-image"
            width={1672}
            height={941}
            sizes="(max-width: 720px) 100vw, 86vw"
          />
        </div>
        <div className="location-index">
          {locationItems.map((item, index) => (
            <div key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <small>{item.type}</small>
            </div>
          ))}
        </div>
      </div>
    </SlideSection>
  );
}
