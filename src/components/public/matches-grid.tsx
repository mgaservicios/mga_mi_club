"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import MatchDetailModal from "./match-detail-modal";
import { Match } from "@/features/matches/types";

function ClientDate({ dateStr }: { dateStr: string }) {
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

  if (!formatted) return <span className="text-xs text-zinc-500 font-medium">&nbsp;</span>;
  return <span className="text-xs text-zinc-500 font-medium">{formatted}</span>;
}

interface MatchesGridProps {
  groupedMatches: Record<string, Match[]>;
  championshipMap: Record<string, string>;
  rivalMap?: Record<string, { name: string; logo_url: string | null; location: string | null }>;
}

export default function MatchesGrid({ groupedMatches, championshipMap, rivalMap }: MatchesGridProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <>
      <div className="space-y-12 max-w-5xl mx-auto">
        {Object.entries(groupedMatches).map(([champId, groupMatches]) => (
          <div key={champId}>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-5 h-5 text-primary" />
              <h3 className="font-bebas text-2xl tracking-[2px] text-white">
                {champId === "sin-campeonato" ? "Otros Partidos" : championshipMap[champId] || "Campeonato"}
              </h3>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupMatches.map((match) => {
                const isWon = match.result ? (() => {
                  const parts = match.result.split("-");
                  return parseInt(parts[0]) > parseInt(parts[1]);
                })() : null;

                return (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className={`bg-[#101010] border rounded-xl overflow-hidden flex items-center gap-4 p-4 hover:border-primary/30 transition-all duration-300 cursor-pointer ${
                      isWon === true ? "border-emerald-500/30" : isWon === false ? "border-red-500/30" : "border-white/8"
                    }`}
                  >
                    {match.rival_id && rivalMap?.[match.rival_id]?.logo_url ? (
                      <div className="w-20 h-20 flex-shrink-0 bg-zinc-900 rounded-lg overflow-hidden">
                        <img
                          src={rivalMap[match.rival_id].logo_url!}
                          alt={match.rival}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : match.image_url ? (
                      <div className="w-20 h-20 flex-shrink-0 bg-zinc-900 rounded-lg overflow-hidden">
                        <img
                          src={match.image_url}
                          alt={`vs ${match.rival}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : null}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {match.matchday && (
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                            Fecha {match.matchday}
                          </span>
                        )}
                        <p className="text-[11px] text-zinc-500 font-medium">
                          <ClientDate dateStr={match.date} />
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bebas text-xl text-white tracking-[1px] truncate">
                          vs {match.rival}
                        </h4>
                        {match.result ? (
                          <span className={`font-bebas text-xl tracking-[1px] flex-shrink-0 ${
                            isWon ? "text-emerald-400" : "text-red-400"
                          }`}>
                            {match.result}
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-500 italic flex-shrink-0">Próx.</span>
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

      {selectedMatch && (
        <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </>
  );
}
