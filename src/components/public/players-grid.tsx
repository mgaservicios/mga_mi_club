"use client";

import { useState } from "react";
import { Player } from "@/features/players/types";
import { POSITION_LABELS } from "@/features/players/constants";
import PlayerModal from "./player-modal";
import { User } from "lucide-react";
import Image from "next/image";

interface PlayersGridProps {
  players: Player[];
}

export default function PlayersGrid({ players }: PlayersGridProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Filtrar solo jugadores (no entrenadores) para la sección principal de la plantilla
  const squadPlayers = players.filter((p) => p.role === "player");
  const staff = players.filter((p) => p.role !== "player");

  return (
    <div className="space-y-12">
      {/* Jugadores */}
      <div>
        <h3 className="font-bebas text-3xl text-white tracking-[2px] mb-8 text-center">
          PLANTILLA DE JUGADORES
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {squadPlayers.map((player) => (
            <div
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className="bg-[#101010] border border-white/8 rounded-lg overflow-hidden cursor-pointer group hover:-translate-y-1 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between h-[170px]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 flex-1">
                {player.photo_url ? (
                  <Image
                    src={player.photo_url}
                    alt={player.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                    <User className="w-6 h-6" />
                  </div>
                )}
                {player.number !== null && (
                  <div className="absolute bottom-1 left-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white font-bebas text-[10px] border border-white/10">
                    #{player.number}
                  </div>
                )}
              </div>

              <div className="p-1.5 bg-[#181818] border-t border-white/5">
                <h4 className="font-bebas text-xs text-white tracking-[0.5px] truncate group-hover:text-primary transition-colors">
                  {player.name}
                </h4>
                <p className="text-[8px] text-zinc-400 mt-0.5">
                  {player.position ? POSITION_LABELS[player.position] : "Jugador"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cuerpo Técnico */}
      {staff.length > 0 && (
        <div className="border-t border-white/10 pt-12">
          <h3 className="font-bebas text-3xl text-white tracking-[2px] mb-8 text-center">
            CUERPO TÉCNICO
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {staff.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedPlayer(member)}
                className="bg-[#101010] border border-white/8 rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 flex items-center p-4 gap-4"
              >
                {member.photo_url ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                    <Image
                      src={member.photo_url}
                      alt={member.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-700 flex-shrink-0">
                    <User className="w-8 h-8" />
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="font-bebas text-lg text-white tracking-[1px] truncate group-hover:text-primary transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {member.role === "head_coach" ? "Entrenador Principal" : "Asistente Técnico"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedPlayer && (
        <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
}
