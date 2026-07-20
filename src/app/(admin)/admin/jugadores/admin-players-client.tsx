"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Player } from "@/features/players/types";
import { deletePlayer } from "@/features/players/actions";
import { ROLE_LABELS, POSITION_LABELS } from "@/features/players/constants";
import PlayerForm from "@/features/players/components/player-form";
import { Plus, Edit2, Trash2, User } from "lucide-react";
import Image from "next/image";

interface AdminPlayersClientProps {
  teamId: string;
  initialPlayers: Player[];
}

export default function AdminPlayersClient({ teamId, initialPlayers }: AdminPlayersClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handleEdit = (player: Player) => {
    setSelectedPlayer(player);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedPlayer(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este miembro?")) {
      try {
        await deletePlayer(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar el miembro");
      }
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setSelectedPlayer(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Miembro</span>
          </button>
        </div>
      )}

      {isEditing ? (
        <PlayerForm
          teamId={teamId}
          player={selectedPlayer}
          onSuccess={handleSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialPlayers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[#111111]/30 rounded-xl border border-white/5 text-zinc-500">
              No hay miembros registrados en el equipo.
            </div>
          ) : (
            initialPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-[#111111]/50 border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-white/20 transition-all"
              >
                {player.photo_url ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                    <Image
                      src={player.photo_url}
                      alt={player.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 flex-shrink-0">
                    <User className="w-8 h-8" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-white truncate">{player.name}</h4>
                  <p className="text-sm text-zinc-400">
                    {ROLE_LABELS[player.role]}
                    {player.role === "player" && player.position && ` • ${POSITION_LABELS[player.position]}`}
                  </p>
                  {player.role === "player" && player.number !== null && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-orange-500/10 text-orange-500 text-xs font-bold rounded border border-orange-500/20">
                      #{player.number}
                    </span>
                  )}

                  <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleEdit(player)}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
