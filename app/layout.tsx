import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Match the Match - Organiza tus partidos de fútbol",
  description: "Aplicación para distribuir jugadores en equipos equilibrados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
