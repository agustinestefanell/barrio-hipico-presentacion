import SlideSection from "./SlideSection";

export default function CoreIdea() {
  return (
    <SlideSection
      id="concepto"
      eyebrow="La idea rectora"
      index="02"
      title="El caballo como estructura urbana"
      intro="El caballo funciona como sistema de movilidad, paisaje e identidad. La red interna de equinovías convierte la vida ecuestre en parte cotidiana del territorio."
      tone="light"
      className="core-idea"
    >
      <div className="concept-grid">
        <div className="concept-diagram" aria-label="Diagrama conceptual de equinovías">
          <div className="diagram-center">
            <span>Equinovías</span>
            <strong>Red continua</strong>
          </div>
          <span className="orbit orbit-one">Vivir</span>
          <span className="orbit orbit-two">Recorrer</span>
          <span className="orbit orbit-three">Encontrarse</span>
          <span className="orbit orbit-four">Valorizar</span>
        </div>
        <div className="concept-copy">
          <p className="large-quote">
            “Salir de casa a caballo y cabalgar por todo el barrio.”
          </p>
          <div className="concept-notes">
            <span>Desde cada sector</span>
            <span>A través de todo el barrio</span>
            <span>Como experiencia cotidiana</span>
          </div>
        </div>
      </div>
    </SlideSection>
  );
}
