import Image from "next/image";

export default function CoverImage() {
  return (
    <section className="cover-image-section">
      <div className="cover-image-box">
        <Image
          src="/images/relleno/Caratula.png"
          alt="Barrio Hípico — Vista del proyecto"
          width={1920}
          height={1080}
          style={{ width: "100%", height: "auto" }}
          priority
        />
      </div>
    </section>
  );
}
