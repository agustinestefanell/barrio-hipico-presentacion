import type { ReactNode } from "react";

type SlideSectionProps = {
  id?: string;
  eyebrow: string;
  index: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  tone?: "light" | "dark" | "copper";
  className?: string;
};

export default function SlideSection({
  id,
  eyebrow,
  index,
  title,
  intro,
  children,
  tone = "light",
  className = "",
}: SlideSectionProps) {
  return (
    <section id={id} className={`slide-section tone-${tone} ${className}`}>
      <div className="section-rail" aria-hidden="true">
        <span>{index}</span>
        <span className="rail-line" />
        <span>BH</span>
      </div>
      <div className="section-inner">
        <header className="section-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {intro && <p className="section-intro">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
