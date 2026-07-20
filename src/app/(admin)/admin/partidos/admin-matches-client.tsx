"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Match } from "@/features/matches/types";
import { deleteMatch, setNextMatch, unsetNextMatch } from "@/features/matches/actions";
import { Championship } from "@/features/championships/types";
import { Rival } from "@/features/rivals/types";
import MatchForm from "@/features/matches/components/match-form";
import { Plus, Edit2, Trash2, Calendar, Star, StarOff, MapPin } from "lucide-react";
import Image from "next/image";

interface AdminMatchesClientProps {
  teamId: string;
  initialMatches: Match[];
  championships: Championship[];
  rivals: Rival[];
}

export default function AdminMatchesClient({
  teamId,
  initialMatches,
  championships,
  rivals,
}: AdminMatchesClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleEdit = (match: Match) => {
    setSelectedMatch(match);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedMatch(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este partido?")) {
      try {
        await deleteMatch(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar el partido");
      }
    }
  };

  const handleToggleNextMatch = async (match: Match) => {
    try {
      if (match.is_next_match) {
        await unsetNextMatch(match.id);
      } else {
        await setNextMatch(teamId, match.id);
      }
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error al actualizar el próximo partido");
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setSelectedMatch(null);
    router.refresh();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChampionshipName = (id: string | null) => {
    if (!id) return null;
    return championships.find((c) => c.id === id)?.name || null;
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
            <span>Agregar Partido</span>
          </button>
        </div>
      )}

      {isEditing ? (
        <MatchForm
          teamId={teamId}
          match={selectedMatch}
          championships={championships}
          rivals={rivals}
          onSuccess={handleSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialMatches.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[#111111]/30 rounded-xl border border-white/5 text-zinc-500">
              No hay partidos registrados.
            </div>
          ) : (
            initialMatches.map((match) => {
              const champName = getChampionshipName(match.championship_id);

              return (
                <div
                  key={match.id}
                  className={`bg-[#111111]/50 border rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all ${match.is_next_match ? "border-orange-500/50 ring-1 ring-orange-500/20" : "border-white/10"
                    }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="text-xs text-zinc-500 font-medium">
                        {formatDate(match.date)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleNextMatch(match)}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all mb-3 ${
                        match.is_next_match
                          ? "bg-orange-500 text-black"
                          : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {match.is_next_match ? (
                        <>
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Próximo Partido
                        </>
                      ) : (
                        <>
                          <StarOff className="w-3.5 h-3.5" />
                          Marcar como próximo
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-xs text-zinc-400">
                        {match.is_home ? "Local" : "Visitante"}
                      </span>
                      {champName && (
                        <span className="text-xs text-orange-500/80 font-semibold truncate">
                          • {champName}
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2">vs {match.rival}</h4>

                    {match.result ? (
                      <div className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-lg">
                        Resultado: {match.result}
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500 italic">Sin resultado aún</span>
                    )}

                    {match.image_url && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10 mt-4 bg-zinc-900">
                        <Image
                          src={match.image_url}
                          alt={match.rival}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleEdit(match)}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(match.id)}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
