import { businessUnits } from "@/data/content";
import SlideSection from "./SlideSection";

export default function BusinessUnits() {
  return (
    <SlideSection
      id="negocio"
      eyebrow="Modelo económico"
      index="05"
      title="Cuatro unidades de negocio"
      intro="La experiencia ecuestre diferencia la tierra; construcción, marca y servicios convierten esa identidad en valorización."
      tone="copper"
      className="business"
    >
      <div className="business-grid">
        {businessUnits.map((unit) => (
          <article className={`business-card unit-${unit.letter.toLowerCase()}`} key={unit.letter}>
            <div className="business-card-head">
              <span className="business-letter">{unit.letter}</span>
              <p>{unit.subtitle}</p>
            </div>
            <h3>{unit.title}</h3>
            <ol>
              {unit.items.map((item, index) => (
                <li key={item}>
                  <span>{unit.letter}{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
            <p className="business-copy">{unit.text}</p>
            {unit.featured && <blockquote>{unit.featured}</blockquote>}
          </article>
        ))}
      </div>
    </SlideSection>
  );
}
