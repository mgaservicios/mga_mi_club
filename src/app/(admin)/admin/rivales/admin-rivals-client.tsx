"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rival } from "@/features/rivals/types";
import { deleteRival } from "@/features/rivals/actions";
import RivalForm from "@/features/rivals/components/rival-form";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";
import Image from "next/image";

interface AdminRivalsClientProps {
  teamId: string;
  initialRivals: Rival[];
}

export default function AdminRivalsClient({ teamId, initialRivals }: AdminRivalsClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRival, setSelectedRival] = useState<Rival | null>(null);

  const handleEdit = (rival: Rival) => {
    setSelectedRival(rival);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedRival(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este rival?")) {
      try {
        await deleteRival(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar el rival");
      }
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setSelectedRival(null);
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
            <span>Agregar Rival</span>
          </button>
        </div>
      )}

      {isEditing ? (
        <RivalForm
          teamId={teamId}
          rival={selectedRival}
          onSuccess={handleSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialRivals.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[#111111]/30 rounded-xl border border-white/5 text-zinc-500">
              No hay rivales registrados.
            </div>
          ) : (
            initialRivals.map((rival) => (
              <div
                key={rival.id}
                className="bg-[#111111]/50 border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  {rival.logo_url ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-zinc-900">
                      <Image
                        src={rival.logo_url}
                        alt={rival.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 flex-shrink-0">
                      <span className="font-bebas text-2xl">{rival.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-white truncate">{rival.name}</h4>
                    {rival.location && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{rival.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleEdit(rival)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(rival.id)}
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
