"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Match } from "@/features/matches/types";
import { News } from "@/features/news/types";
import { GalleryImage } from "@/features/gallery/types";
import { Album } from "@/features/gallery/album-types";
import MatchesGrid from "./matches-grid";
import PlayersGrid from "./players-grid";
import NewsGrid from "./news-grid";
import HistoryModal from "./history-modal";
import FullGalleryModal from "./full-gallery-modal";
import FullMatchesModal from "./full-matches-modal";
import FullNewsModal from "./full-news-modal";

interface PublicPageSectionsProps {
  teamHistory: string;
  players: any[];
  groupedMatches: Record<string, Match[]>;
  championshipMap: Record<string, string>;
  rivalMap: Record<string, { name: string; logo_url: string | null; location: string | null }>;
  matches: Match[];
  images: GalleryImage[];
  albums: Album[];
  news: News[];
}

export default function PublicPageSections({
  teamHistory,
  players,
  groupedMatches,
  championshipMap,
  rivalMap,
  matches,
  images,
  albums,
  news,
}: PublicPageSectionsProps) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showMatchesModal, setShowMatchesModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);

  const recentMatches = Object.fromEntries(
    Object.entries(groupedMatches).map(([key, vals]) => [key, vals.slice(0, 4)])
  );
  const previewImages = images.slice(0, 6);
  const previewNews = news.slice(0, 3);

  return (
    <>
      {/* EQUIPO SECTION */}
      <section id="equipo" className="relative py-24 overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />
          <Image src="/fondos/fondoequipo.png" alt="Equipo Background" fill className="object-cover opacity-40" unoptimized />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-sans text-4xl sm:text-5xl font-black tracking-wide uppercase">
              NUESTRO <span className="text-primary">EQUIPO</span>
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto" />
            <p className="text-zinc-400">Conocé a los jugadores y cuerpo técnico que defienden los colores de Street Dogs.</p>
          </div>
          <PlayersGrid players={players} />
        </div>
      </section>

      {/* PARTIDOS SECTION */}
      <section id="partidos" className="relative py-24 overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />
          <Image src="/fondos/fondopartidos.png" alt="Partidos Background" fill className="object-cover opacity-40" unoptimized />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-sans text-4xl sm:text-5xl font-black tracking-wide uppercase">
              PARTIDOS Y <span className="text-primary">RESULTADOS</span>
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto" />
            <p className="text-zinc-400">Calendario de encuentros y resultados de la temporada.</p>
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 italic">No hay partidos registrados.</div>
          ) : (
            <>
              <MatchesGrid groupedMatches={recentMatches} championshipMap={championshipMap} rivalMap={rivalMap} />
              {matches.length > 4 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowMatchesModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-primary/30 text-white font-bold text-sm tracking-wider uppercase rounded-full hover:bg-primary/10 transition-all"
                  >
                    Ver todos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* GALERIA SECTION */}
      <section id="galeria" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />
          <Image src="/fondos/fondogaleria.png" alt="Galería Background" fill className="object-cover opacity-40" unoptimized />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-sans text-4xl sm:text-5xl font-black tracking-wide uppercase">
              GALERÍA DE <span className="text-primary">FOTOS</span>
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto" />
            <p className="text-zinc-400">Los mejores momentos de Street Dogs capturados en imágenes.</p>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 italic">No hay fotos disponibles.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {previewImages.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
                    <Image src={img.image_url} alt={img.title} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
              {images.length > 6 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowGalleryModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-primary/30 text-white font-bold text-sm tracking-wider uppercase rounded-full hover:bg-primary/10 transition-all"
                  >
                    Ver todas
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* NOTICIAS SECTION */}
      <section id="noticias" className="relative py-24 overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />
          <Image src="/fondos/fondonoticias.png" alt="Noticias Background" fill className="object-cover opacity-40" unoptimized />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-sans text-4xl sm:text-5xl font-black tracking-wide uppercase">
              ÚLTIMAS <span className="text-primary">NOTICIAS</span>
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto" />
            <p className="text-zinc-400">Mantente al día con las novedades y crónicas del club.</p>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 italic">No hay noticias publicadas.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NewsGrid news={previewNews} />
              </div>
              {news.length > 3 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowNewsModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-primary/30 text-white font-bold text-sm tracking-wider uppercase rounded-full hover:bg-primary/10 transition-all"
                  >
                    Ver todas
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {showHistoryModal && <HistoryModal history={teamHistory} onClose={() => setShowHistoryModal(false)} />}
      {showGalleryModal && <FullGalleryModal images={images} albums={albums} onClose={() => setShowGalleryModal(false)} />}
      {showMatchesModal && <FullMatchesModal groupedMatches={groupedMatches} championshipMap={championshipMap} rivalMap={rivalMap} onClose={() => setShowMatchesModal(false)} />}
      {showNewsModal && <FullNewsModal news={news} onClose={() => setShowNewsModal(false)} />}
    </>
  );
}
