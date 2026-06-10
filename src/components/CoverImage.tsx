import Image from "next/image";

export default function CoverImage() {
  return (
    <section className="cover-image-section">
      <div className="cover-image-box">
        <Image
          src="/images/relleno/2a%20imagen.png"
          alt="Barrio Hípico — Vista complementaria"
          width={1920}
          height={1080}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </section>
  );
}
