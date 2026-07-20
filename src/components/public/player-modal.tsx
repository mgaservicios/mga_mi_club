"use client";

import { useEffect } from "react";
import { Player } from "@/features/players/types";
import { POSITION_LABELS } from "@/features/players/constants";
import { X, User } from "lucide-react";
import Image from "next/image";

interface PlayerModalProps {
  player: Player;
  onClose: () => void;
}

export default function PlayerModal({ player, onClose }: PlayerModalProps) {
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#101010] border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Foto */}
          <div className="relative aspect-[4/5] md:aspect-auto md:h-full min-h-[300px] bg-zinc-900">
            {player.photo_url ? (
              <Image
                src={player.photo_url}
                alt={player.name}
                fill
                className="object-contain p-4"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                <User className="w-24 h-24" />
              </div>
            )}
            {player.number !== null && (
              <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bebas text-3xl border-2 border-white/10 shadow-lg">
                #{player.number}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs text-primary font-bold uppercase tracking-wider">
                {player.position ? POSITION_LABELS[player.position] : "Cuerpo Técnico"}
              </span>
              <h3 className="font-bebas text-4xl text-white tracking-[1px] mt-1">
                {player.name}
              </h3>

              {player.bio && (
                <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                  {player.bio}
                </p>
              )}

              {player.previous_clubs && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    Clubes Anteriores
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1">
                    {player.previous_clubs}
                  </p>
                </div>
              )}
            </div>

            {/* Estadísticas */}
            {player.role === "player" && (
              <div className="border-t border-white/10 pt-6">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                  Estadísticas de Temporada
                </h4>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2">
                    <span className="block text-[10px] text-zinc-500 font-bold">PTS</span>
                    <span className="text-lg font-bebas text-white">{player.points}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2">
                    <span className="block text-[10px] text-zinc-500 font-bold">REB</span>
                    <span className="text-lg font-bebas text-white">{player.rebounds}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2">
                    <span className="block text-[10px] text-zinc-500 font-bold">AST</span>
                    <span className="text-lg font-bebas text-white">{player.assists}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2">
                    <span className="block text-[10px] text-zinc-500 font-bold">ROB</span>
                    <span className="text-lg font-bebas text-white">{player.steals}</span>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-lg p-2">
                    <span className="block text-[10px] text-zinc-500 font-bold">MIN</span>
                    <span className="text-lg font-bebas text-white">{player.minutes}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
