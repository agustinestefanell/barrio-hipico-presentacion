import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barrio Hípico | Presentación estratégica",
  description:
    "Presentación de Barrio Hípico, un barrio privado ecuestre en Canelones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
