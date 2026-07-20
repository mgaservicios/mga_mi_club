"use client";

import { useState } from "react";
import { Player } from "@/features/players/types";
import { POSITION_LABELS, ROLE_LABELS } from "@/features/players/constants";
import PlayerModal from "./player-modal";
import { User } from "lucide-react";
import Image from "next/image";

interface PlayersGridProps {
  players: Player[];
}

export default function PlayersGrid({ players }: PlayersGridProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const squadPlayers = players.filter((p) => p.role === "player");
  const staff = players.filter((p) => p.role !== "player");

  return (
    <div>
      <h3 className="font-bebas text-3xl text-white tracking-[2px] mb-8 text-center">
        JUGADORES Y CUERPO TÉCNICO
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {squadPlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => setSelectedPlayer(player)}
            className="bg-[#101010] border border-white/8 rounded-lg overflow-hidden cursor-pointer group hover:-translate-y-1 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between h-[190px]"
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
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {player.position && (
                  <p className="text-[8px] text-zinc-400">
                    {POSITION_LABELS[player.position]}
                  </p>
                )}
                {player.birth_date && (
                  <>
                    <span className="text-[8px] text-zinc-600">•</span>
                    <p className="text-[8px] text-zinc-400">
                      {(() => {
                        const birth = new Date(player.birth_date);
                        const today = new Date();
                        let age = today.getFullYear() - birth.getFullYear();
                        const m = today.getMonth() - birth.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                        return age >= 0 ? `${age} años` : "";
                      })()}
                    </p>
                  </>
                )}
                {player.height_cm && (
                  <>
                    <span className="text-[8px] text-zinc-600">•</span>
                    <p className="text-[8px] text-zinc-400">{player.height_cm}cm</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {staff.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedPlayer(member)}
            className="bg-white border border-white/8 rounded-lg overflow-hidden cursor-pointer group hover:-translate-y-1 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between h-[190px]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 flex-1">
              {member.photo_url ? (
                <Image
                  src={member.photo_url}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="p-1.5 bg-gray-100 border-t border-gray-200">
              <h4 className="font-bebas text-xs text-gray-900 tracking-[0.5px] truncate group-hover:text-primary transition-colors">
                {member.name}
              </h4>
              <p className="text-[8px] text-gray-600 mt-0.5">
                {ROLE_LABELS[member.role]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
}
