"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Standing } from "@/features/standings/types";
import { deleteStanding } from "@/features/standings/actions";
import { Championship } from "@/features/championships/types";
import StandingsForm from "@/features/standings/components/standings-form";
import { Plus, Edit2, Trash2, BarChart3 } from "lucide-react";

interface AdminStandingsClientProps {
  teamId: string;
  initialStandings: Standing[];
  championships: Championship[];
}

export default function AdminStandingsClient({
  teamId,
  initialStandings,
  championships,
}: AdminStandingsClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStanding, setSelectedStanding] = useState<Standing | null>(null);

  const handleEdit = (standing: Standing) => {
    setSelectedStanding(standing);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedStanding(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta fila de clasificación?")) {
      try {
        await deleteStanding(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar la clasificación");
      }
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setSelectedStanding(null);
    router.refresh();
  };

  const getChampionshipName = (id: string | null) => {
    if (!id) return "General";
    return championships.find((c) => c.id === id)?.name || "General";
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
            <span>Agregar Fila</span>
          </button>
        </div>
      )}

      {isEditing ? (
        <StandingsForm
          teamId={teamId}
          standing={selectedStanding}
          championships={championships}
          onSuccess={handleSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="bg-[#111111]/50 border border-white/10 rounded-xl overflow-hidden">
          {initialStandings.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              No hay datos de clasificación registrados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    <th className="p-4 text-center w-16">Pos</th>
                    <th className="p-4">Equipo</th>
                    <th className="p-4">Campeonato</th>
                    <th className="p-4 text-center w-20">PJ</th>
                    <th className="p-4 text-center w-20">PG</th>
                    <th className="p-4 text-center w-20">PP</th>
                    <th className="p-4 text-center w-24">PTS</th>
                    <th className="p-4 text-center w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {initialStandings.map((row) => (
                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-bold text-orange-500">
                        {row.position}
                      </td>
                      <td className="p-4 font-semibold text-white">
                        {row.team_name}
                      </td>
                      <td className="p-4 text-zinc-400">
                        {getChampionshipName(row.championship_id)}
                      </td>
                      <td className="p-4 text-center text-zinc-300">{row.played}</td>
                      <td className="p-4 text-center text-green-400">{row.won}</td>
                      <td className="p-4 text-center text-red-400">{row.lost}</td>
                      <td className="p-4 text-center font-bold text-white">{row.points}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(row)}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
