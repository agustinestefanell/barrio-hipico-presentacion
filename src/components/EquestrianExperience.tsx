import { experienceItems } from "@/data/content";
import SlideSection from "./SlideSection";

export default function EquestrianExperience() {
  return (
    <SlideSection
      id="experiencia"
      eyebrow="Experiencia de vida"
      index="04"
      title="Salir de casa y cabalgar por el barrio"
      intro="La red interna de equinovías conecta vivienda, recorridos, servicios y comunidad en una misma experiencia cotidiana."
      tone="light"
      className="experience"
    >
      <ol className="experience-journey">
        {experienceItems.map((item, index) => (
          <li
            className={index === 0 || index === 8 ? "experience-step featured-step" : "experience-step"}
            key={item.number}
          >
            <span>{item.number}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </SlideSection>
  );
}
