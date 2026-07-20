"use client";

import { useEffect, useState } from "react";
import { X, Trophy } from "lucide-react";
import { Match } from "@/features/matches/types";

interface FullMatchesModalProps {
  groupedMatches: Record<string, Match[]>;
  championshipMap: Record<string, string>;
  rivalMap?: Record<string, { name: string; logo_url: string | null; location: string | null }>;
  onClose: () => void;
}

function ClientDateModal({ dateStr }: { dateStr: string }) {
  const [formatted, setFormatted] = useState("");
  useEffect(() => {
    setFormatted(
      new Date(dateStr).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [dateStr]);
  if (!formatted) return <span className="text-xs text-zinc-500">&nbsp;</span>;
  return <span className="text-xs text-zinc-500">{formatted}</span>;
}

export default function FullMatchesModal({ groupedMatches, championshipMap, rivalMap, onClose }: FullMatchesModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 pt-24 sm:p-8 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="relative bg-[#101010] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="sticky top-3 float-right mr-3 mt-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h3 className="font-bebas text-3xl text-white tracking-[1px] mb-4">
            PARTIDOS Y <span className="text-primary">RESULTADOS</span>
          </h3>
          <div className="w-12 h-1 bg-primary mb-6" />

          <div className="space-y-8">
            {Object.entries(groupedMatches).map(([champId, groupMatches]) => (
              <div key={champId}>
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h4 className="font-bebas text-xl tracking-[2px] text-white">
                    {champId === "sin-campeonato" ? "Otros Partidos" : championshipMap[champId] || "Campeonato"}
                  </h4>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupMatches.map((match) => {
                    const isWon = match.result ? (() => {
                      const parts = match.result.split("-");
                      return parseInt(parts[0]) > parseInt(parts[1]);
                    })() : null;

                    return (
                      <div
                        key={match.id}
                        className={`bg-[#0a0a0a] border rounded-lg overflow-hidden flex items-center gap-3 p-3 ${
                          isWon === true ? "border-emerald-500/30" : isWon === false ? "border-red-500/30" : "border-white/8"
                        }`}
                      >
                        {match.rival_id && rivalMap?.[match.rival_id]?.logo_url ? (
                          <div className="w-14 h-14 flex-shrink-0 bg-zinc-900 rounded-lg overflow-hidden">
                            <img src={rivalMap[match.rival_id].logo_url!} alt={match.rival} className="w-full h-full object-contain" />
                          </div>
                        ) : match.image_url ? (
                          <div className="w-14 h-14 flex-shrink-0 bg-zinc-900 rounded-lg overflow-hidden">
                            <img src={match.image_url} alt={`vs ${match.rival}`} className="w-full h-full object-contain" />
                          </div>
                        ) : null}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            {match.matchday && (
                              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                                Fecha {match.matchday}
                              </span>
                            )}
                            <p className="text-[10px] text-zinc-500"><ClientDateModal dateStr={match.date} /></p>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bebas text-lg text-white tracking-[1px] truncate">vs {match.rival}</span>
                            {match.result ? (
                              <span className={`font-bebas text-lg tracking-[1px] flex-shrink-0 ${isWon ? "text-emerald-400" : "text-red-400"}`}>
                                {match.result}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-500 italic">Próx.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
