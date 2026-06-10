import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-rings" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-topline">
        <span>Presentación estratégica</span>
        <span>Consultores inmobiliarios · Inversores</span>
      </div>
      <div className="hero-content">
        <p className="eyebrow light">Barrio privado ecuestre en Canelones</p>
        <h1>
          Barrio
          <em>Hípico</em>
        </h1>
        <p className="hero-subtitle">Urbanización de lujo enfocada en los caballos</p>
        <div className="hero-triptych">
          <Image
            src="/images/hero/hero-triptych.png"
            alt="Barrio Hípico — tres escenas"
            width={1800}
            height={600}
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>
        <div className="hero-actions">
          <Link href="#concepto" className="button button-primary">
            Ver proyecto <span aria-hidden="true">↓</span>
          </Link>
          <Link href="/polo-logistico" className="button button-secondary">
            Opción terrenos polo logístico
          </Link>
        </div>
      </div>
      <div className="hero-statement">
        <span className="statement-number">01</span>
        <p>
          El caballo no es un amenity aislado.
          <strong>Es movilidad, paisaje e identidad.</strong>
        </p>
      </div>
      <div className="hero-footer">
        <span>Red interna de equinovías</span>
        <span>Canelones · Uruguay</span>
        <span>Desplazar para recorrer</span>
      </div>
    </section>
  );
}
