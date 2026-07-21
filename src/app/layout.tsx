import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Street Dogs | Básquet +40 Patagonia",
  description: "Pasión. Garra. Equipo. Sitio oficial del club Street Dogs de básquet +40 de la Patagonia.",
  openGraph: {
    title: "Street Dogs | Pasión. Garra. Equipo.",
    description: "Sitio oficial del club Street Dogs de básquet +40 de la Patagonia.",
    images: [
      {
        url: "/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "Street Dogs - Pasión. Garra. Equipo.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Street Dogs | Pasión. Garra. Equipo.",
    description: "Sitio oficial del club Street Dogs de básquet +40 de la Patagonia.",
    images: ["/logos/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
