"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Championship } from "@/features/championships/types";
import { deleteChampionship } from "@/features/championships/actions";
import ChampionshipForm from "@/features/championships/components/championship-form";
import { Plus, Edit2, Trash2, Trophy, Calendar } from "lucide-react";
import Image from "next/image";

interface AdminChampionshipsClientProps {
  teamId: string;
  initialChampionships: Championship[];
}

export default function AdminChampionshipsClient({
  teamId,
  initialChampionships,
}: AdminChampionshipsClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedChampionship, setSelectedChampionship] = useState<Championship | null>(null);

  const handleEdit = (championship: Championship) => {
    setSelectedChampionship(championship);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedChampionship(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este campeonato?")) {
      try {
        await deleteChampionship(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar el campeonato");
      }
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setSelectedChampionship(null);
    router.refresh();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Argentina/Buenos_Aires",
    });
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
            <span>Agregar Campeonato</span>
          </button>
        </div>
      )}

      {isEditing ? (
        <ChampionshipForm
          teamId={teamId}
          championship={selectedChampionship}
          onSuccess={handleSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialChampionships.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[#111111]/30 rounded-xl border border-white/5 text-zinc-500">
              No hay campeonatos registrados.
            </div>
          ) : (
            initialChampionships.map((champ) => (
              <div
                key={champ.id}
                className="bg-[#111111]/50 border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  {champ.logo_url ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-zinc-900">
                      <Image
                        src={champ.logo_url}
                        alt={champ.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 flex-shrink-0">
                      <Trophy className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-white truncate">{champ.name}</h4>
                    {champ.organizer && (
                      <p className="text-sm text-zinc-400 truncate">{champ.organizer}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {formatDate(champ.start_date)} - {formatDate(champ.end_date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleEdit(champ)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(champ.id)}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
