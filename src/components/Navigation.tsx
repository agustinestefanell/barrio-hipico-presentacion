"use client";

import Link from "next/link";
import { useState } from "react";
import { navigation } from "@/data/content";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <Link href="/" className="brand-mark" aria-label="Barrio Hípico, inicio">
        <span>BH</span>
        <span className="brand-copy">
          Barrio Hípico
          <small>Canelones · Uruguay</small>
        </span>
      </Link>

      <button
        className="nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
        <span className="sr-only">Abrir navegación</span>
      </button>

      <nav
        id="main-navigation"
        className={open ? "nav-links is-open" : "nav-links"}
        aria-label="Recorrido de la presentación"
      >
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
