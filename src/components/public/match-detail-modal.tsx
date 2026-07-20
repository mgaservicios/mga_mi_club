"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface MatchDetailModalProps {
  match: {
    rival: string;
    date: string;
    matchday: number | null;
    result: string | null;
    summary: string | null;
    image_url: string | null;
    images: string[];
  };
  onClose: () => void;
}

export default function MatchDetailModal({ match, onClose }: MatchDetailModalProps) {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxImg) {
          setLightboxImg(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, lightboxImg]);

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      new Date(match.date).toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
      })
    );
  }, [match.date]);

  const isWon = match.result ? (() => {
    const parts = match.result.split("-");
    return parseInt(parts[0]) > parseInt(parts[1]);
  })() : null;

  const allImages = [match.image_url, ...match.images].filter(Boolean) as string[];

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 pt-24 sm:p-8 sm:pt-24"
        onClick={onClose}
      >
        <div
          className="relative bg-[#101010] border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {allImages.length > 0 ? (
            <div
              className="w-full bg-black rounded-t-2xl cursor-pointer"
              onClick={() => setLightboxImg(allImages[0])}
            >
              <img
                src={allImages[0]}
                alt={`vs ${match.rival}`}
                className="w-full object-contain"
                style={{ maxHeight: "30vh" }}
              />
            </div>
          ) : (
            <div className="h-2 w-full rounded-t-2xl" />
          )}

          <div className="p-5">
            <div className="flex items-center gap-2 mb-1">
              {match.matchday && (
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                  Fecha {match.matchday}
                </span>
              )}
              <p className="text-[11px] text-zinc-500 font-medium">{formattedDate}</p>
            </div>

            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="font-bebas text-3xl text-white tracking-[1px]">vs {match.rival}</h3>
              {match.result && (
                <span className={`font-bebas text-3xl tracking-[1px] flex-shrink-0 ${
                  isWon ? "text-emerald-400" : "text-red-400"
                }`}>
                  {match.result}
                </span>
              )}
            </div>

            {match.result && (
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isWon ? "text-emerald-400" : "text-red-400"
              }`}>
                {isWon ? "GANADO" : "PERDIDO"}
              </span>
            )}

            {match.summary && (
              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Resumen del Partido
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {match.summary}
                </p>
              </div>
            )}

            {allImages.length > 1 && (
              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                  Galería del Partido
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {allImages.slice(1).map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => setLightboxImg(img)}
                    >
                      <img
                        src={img}
                        alt={`Foto ${i + 2}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxImg && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/98 p-4 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImg}
            alt="Foto completa"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}
