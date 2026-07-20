"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Player, PlayerRole, Position } from "@/features/players/types";
import { deletePlayer, updatePlayer } from "@/features/players/actions";
import { ROLE_LABELS, POSITION_LABELS } from "@/features/players/constants";
import PlayerForm from "@/features/players/components/player-form";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Loader2,
  User,
} from "lucide-react";
import Image from "next/image";

interface AdminPlayersClientProps {
  teamId: string;
  initialPlayers: Player[];
}

function calcAge(birthDate: string | null): string {
  if (!birthDate) return "—";
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? `${age} años` : "—";
}

export default function AdminPlayersClient({
  teamId,
  initialPlayers,
}: AdminPlayersClientProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [viewPlayer, setViewPlayer] = useState<Player | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, any>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleCreate = () => {
    setSelectedPlayer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (player: Player) => {
    setSelectedPlayer(player);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este miembro?")) {
      try {
        await deletePlayer(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar");
      }
    }
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedPlayer(null);
    router.refresh();
  };

  const startInlineEdit = (player: Player) => {
    setEditingId(player.id);
    setEditDraft({
      name: player.name,
      number: player.number?.toString() || "",
      role: player.role,
      position: player.position || "",
      birth_date: player.birth_date || "",
      height_cm: player.height_cm?.toString() || "",
    });
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const saveInlineEdit = async (player: Player) => {
    setSavingId(player.id);
    try {
      await updatePlayer(player.id, {
        team_id: teamId,
        name: editDraft.name,
        number: editDraft.number !== "" ? Number(editDraft.number) : null,
        role: editDraft.role as PlayerRole,
        position:
          editDraft.role === "player" && editDraft.position !== ""
            ? (editDraft.position as Position)
            : null,
        birth_date: editDraft.birth_date || null,
        height_cm: editDraft.height_cm !== "" ? Number(editDraft.height_cm) : null,
      });
      setEditingId(null);
      setEditDraft({});
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error al guardar");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Miembro</span>
        </button>
      </div>

      {isFormOpen && (
        <PlayerForm
          teamId={teamId}
          player={selectedPlayer}
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedPlayer(null);
          }}
        />
      )}

      {initialPlayers.length === 0 ? (
        <div className="text-center py-12 bg-[#111111]/30 rounded-xl border border-white/5 text-zinc-500">
          No hay miembros registrados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#111111]/60">
                <th className="text-left px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider w-12"></th>
                <th className="text-left px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Nombre</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider w-14">#</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden lg:table-cell">Posición</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden lg:table-cell">Edad</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden xl:table-cell">F. Nac.</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden xl:table-cell">Altura</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider w-28">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {initialPlayers.map((player) => {
                const isEditing = editingId === player.id;
                const isSaving = savingId === player.id;

                return (
                  <tr
                    key={player.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Avatar */}
                    <td className="px-4 py-3">
                      {player.photo_url ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
                          <Image
                            src={player.photo_url}
                            alt={player.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </td>

                    {/* Nombre */}
                    <td className="px-4 py-3 text-white font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editDraft.name}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, name: e.target.value })
                          }
                          className="w-full rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs focus:border-orange-500 focus:outline-none"
                        />
                      ) : (
                        <span className="truncate max-w-[180px] block">{player.name}</span>
                      )}
                    </td>

                    {/* Número */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          max={99}
                          value={editDraft.number}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, number: e.target.value })
                          }
                          className="w-14 rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs text-center focus:border-orange-500 focus:outline-none"
                        />
                      ) : player.number !== null ? (
                        <span className="inline-block px-1.5 py-0.5 bg-orange-500/10 text-orange-500 text-xs font-bold rounded border border-orange-500/20">
                          #{player.number}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Rol */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      {isEditing ? (
                        <select
                          value={editDraft.role}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, role: e.target.value })
                          }
                          className="w-full rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs focus:border-orange-500 focus:outline-none"
                        >
                          <option value="player">Jugador</option>
                          <option value="head_coach">Entrenador Principal</option>
                          <option value="assistant_coach">Asistente Técnico</option>
                        </select>
                      ) : (
                        <span className="text-xs text-zinc-300">
                          {ROLE_LABELS[player.role]}
                        </span>
                      )}
                    </td>

                    {/* Posición */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {isEditing ? (
                        editDraft.role === "player" ? (
                          <select
                            value={editDraft.position}
                            onChange={(e) =>
                              setEditDraft({ ...editDraft, position: e.target.value })
                            }
                            className="w-full rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs focus:border-orange-500 focus:outline-none"
                          >
                            <option value="">—</option>
                            <option value="base">Base</option>
                            <option value="escolta">Escolta</option>
                            <option value="alero">Alero</option>
                            <option value="ala_pivot">Ala-Pívot</option>
                            <option value="pivot">Pívot</option>
                          </select>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )
                      ) : player.role === "player" && player.position ? (
                        <span className="text-xs text-zinc-400">
                          {POSITION_LABELS[player.position]}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Edad (calculada, no editable) */}
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className="text-xs text-zinc-400">
                        {calcAge(player.birth_date)}
                      </span>
                    </td>

                    {/* Fecha Nacimiento */}
                    <td className="px-4 py-3 hidden xl:table-cell">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editDraft.birth_date}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, birth_date: e.target.value })
                          }
                          className="w-full rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs focus:border-orange-500 focus:outline-none"
                        />
                      ) : (
                        <span className="text-xs text-zinc-400">
                          {player.birth_date || "—"}
                        </span>
                      )}
                    </td>

                    {/* Altura */}
                    <td className="px-4 py-3 text-center hidden xl:table-cell">
                      {isEditing ? (
                        <div className="flex items-center gap-1 justify-center">
                          <input
                            type="number"
                            min={0}
                            max={250}
                            value={editDraft.height_cm}
                            onChange={(e) =>
                              setEditDraft({ ...editDraft, height_cm: e.target.value })
                            }
                            className="w-16 rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs text-center focus:border-orange-500 focus:outline-none"
                          />
                          <span className="text-[10px] text-zinc-500">cm</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400">
                          {player.height_cm ? `${player.height_cm} cm` : "—"}
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveInlineEdit(player)}
                              disabled={isSaving}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                              title="Guardar"
                            >
                              {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={cancelInlineEdit}
                              disabled={isSaving}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(player)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                              title="Formulario completo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startInlineEdit(player)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-zinc-400 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                              title="Edición rápida"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button
                              onClick={() => setViewPlayer(player)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                              title="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(player.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Player Detail Modal */}
      {viewPlayer && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="font-bebas text-xl text-white tracking-wide">Detalle del Miembro</h3>
              <button
                onClick={() => setViewPlayer(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                {viewPlayer.photo_url ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-white/10">
                    <Image
                      src={viewPlayer.photo_url}
                      alt={viewPlayer.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                    <User className="w-10 h-10" />
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold text-white">{viewPlayer.name}</h4>
                  <p className="text-sm text-zinc-400">
                    {ROLE_LABELS[viewPlayer.role]}
                    {viewPlayer.role === "player" &&
                      viewPlayer.position &&
                      ` • ${POSITION_LABELS[viewPlayer.position]}`}
                  </p>
                  {viewPlayer.role === "player" && viewPlayer.number !== null && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-500/10 text-orange-500 text-xs font-bold rounded border border-orange-500/20">
                      #{viewPlayer.number}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-zinc-500 text-xs">Edad</span>
                  <p className="text-white">{calcAge(viewPlayer.birth_date)}</p>
                </div>
                {viewPlayer.position && (
                  <div>
                    <span className="text-zinc-500 text-xs">Posición</span>
                    <p className="text-white">{POSITION_LABELS[viewPlayer.position]}</p>
                  </div>
                )}
                {viewPlayer.height_cm && (
                  <div>
                    <span className="text-zinc-500 text-xs">Altura</span>
                    <p className="text-white">{viewPlayer.height_cm} cm</p>
                  </div>
                )}
                {viewPlayer.birth_date && (
                  <div>
                    <span className="text-zinc-500 text-xs">Fecha de Nacimiento</span>
                    <p className="text-white">{viewPlayer.birth_date}</p>
                  </div>
                )}
                {viewPlayer.birthplace && (
                  <div>
                    <span className="text-zinc-500 text-xs">Lugar</span>
                    <p className="text-white">{viewPlayer.birthplace}</p>
                  </div>
                )}
                {viewPlayer.phone && (
                  <div>
                    <span className="text-zinc-500 text-xs">Teléfono</span>
                    <p className="text-white">{viewPlayer.phone}</p>
                  </div>
                )}
                {viewPlayer.email && (
                  <div className="col-span-2">
                    <span className="text-zinc-500 text-xs">Email</span>
                    <p className="text-white">{viewPlayer.email}</p>
                  </div>
                )}
                {viewPlayer.previous_clubs && (
                  <div className="col-span-2">
                    <span className="text-zinc-500 text-xs">Clubes Anteriores</span>
                    <p className="text-white text-sm">{viewPlayer.previous_clubs}</p>
                  </div>
                )}
                {viewPlayer.bio && (
                  <div className="col-span-2">
                    <span className="text-zinc-500 text-xs">Bio</span>
                    <p className="text-white text-sm">{viewPlayer.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
