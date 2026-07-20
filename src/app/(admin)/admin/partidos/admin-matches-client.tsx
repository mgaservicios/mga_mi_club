"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Match } from "@/features/matches/types";
import {
  deleteMatch,
  setNextMatch,
  unsetNextMatch,
  updateMatch,
} from "@/features/matches/actions";
import { Championship } from "@/features/championships/types";
import { Rival } from "@/features/rivals/types";
import MatchForm from "@/features/matches/components/match-form";
import MatchDetailModal from "@/components/public/match-detail-modal";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  StarOff,
  Check,
  X,
  Loader2,
} from "lucide-react";
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [viewMatch, setViewMatch] = useState<Match | null>(null);

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, any>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const championshipMap = Object.fromEntries(
    championships.map((c) => [c.id, c.name])
  );

  const handleCreate = () => {
    setSelectedMatch(null);
    setIsFormOpen(true);
  };

  const handleEdit = (match: Match) => {
    setSelectedMatch(match);
    setIsFormOpen(true);
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
      alert(err.message || "Error al actualizar");
    }
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedMatch(null);
    router.refresh();
  };

  const startInlineEdit = (match: Match) => {
    setEditingId(match.id);
    setEditDraft({
      rival: match.rival,
      result: match.result || "",
      matchday: match.matchday?.toString() || "",
      is_home: match.is_home,
      championship_id: match.championship_id || "",
      date: match.date ? new Date(match.date).toISOString().slice(0, 16) : "",
    });
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const saveInlineEdit = async (match: Match) => {
    setSavingId(match.id);
    try {
      const champId = editDraft.championship_id || null;
      await updateMatch(match.id, {
        team_id: teamId,
        rival: editDraft.rival,
        rival_id: match.rival_id,
        date: new Date(editDraft.date).toISOString(),
        matchday: editDraft.matchday ? parseInt(editDraft.matchday) : null,
        is_home: editDraft.is_home,
        result: editDraft.result || null,
        championship_id: champId,
        summary: match.summary,
        image_url: match.image_url,
        images: match.images,
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Partido</span>
        </button>
      </div>

      {isFormOpen && (
        <MatchForm
          teamId={teamId}
          match={selectedMatch}
          championships={championships}
          rivals={rivals}
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedMatch(null);
          }}
        />
      )}

      {initialMatches.length === 0 ? (
        <div className="text-center py-12 bg-[#111111]/30 rounded-xl border border-white/5 text-zinc-500">
          No hay partidos registrados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#111111]/60">
                <th className="text-left px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Rival</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden lg:table-cell">Campeonato</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Cond.</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Fecha#</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider">Resultado</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider w-20">Próx.</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-zinc-400 uppercase tracking-wider w-28">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {initialMatches.map((match) => {
                const isEditing = editingId === match.id;
                const isSaving = savingId === match.id;

                return (
                  <tr
                    key={match.id}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                      match.is_next_match ? "bg-orange-500/5" : ""
                    }`}
                  >
                    {/* Fecha */}
                    <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="datetime-local"
                          value={editDraft.date}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, date: e.target.value })
                          }
                          className="w-full rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs focus:border-orange-500 focus:outline-none"
                        />
                      ) : (
                        <span className="text-xs">{formatDate(match.date)}</span>
                      )}
                    </td>

                    {/* Rival */}
                    <td className="px-4 py-3 text-white font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editDraft.rival}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, rival: e.target.value })
                          }
                          className="w-full rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs focus:border-orange-500 focus:outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          {match.image_url && (
                            <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={match.image_url}
                                alt={match.rival}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <span className="truncate max-w-[160px]">{match.rival}</span>
                        </div>
                      )}
                    </td>

                    {/* Campeonato */}
                    <td className="px-4 py-3 text-zinc-400 hidden lg:table-cell">
                      {isEditing ? (
                        <select
                          value={editDraft.championship_id}
                          onChange={(e) =>
                            setEditDraft({
                              ...editDraft,
                              championship_id: e.target.value,
                            })
                          }
                          className="w-full rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs focus:border-orange-500 focus:outline-none"
                        >
                          <option value="">—</option>
                          {championships.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs truncate">
                          {match.championship_id ? (championshipMap[match.championship_id] || "—") : "—"}
                        </span>
                      )}
                    </td>

                    {/* Condición */}
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      {isEditing ? (
                        <select
                          value={editDraft.is_home ? "true" : "false"}
                          onChange={(e) =>
                            setEditDraft({
                              ...editDraft,
                              is_home: e.target.value === "true",
                            })
                          }
                          className="rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs focus:border-orange-500 focus:outline-none"
                        >
                          <option value="true">Local</option>
                          <option value="false">Visitante</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            match.is_home
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {match.is_home ? "Local" : "Visit."}
                        </span>
                      )}
                    </td>

                    {/* Fecha# (matchday) */}
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      {isEditing ? (
                        <input
                          type="number"
                          min={1}
                          value={editDraft.matchday}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, matchday: e.target.value })
                          }
                          className="w-16 rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs text-center focus:border-orange-500 focus:outline-none"
                        />
                      ) : (
                        <span className="text-xs text-zinc-400">
                          {match.matchday ? `#${match.matchday}` : "—"}
                        </span>
                      )}
                    </td>

                    {/* Resultado */}
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editDraft.result}
                          onChange={(e) =>
                            setEditDraft({ ...editDraft, result: e.target.value })
                          }
                          placeholder="85-78"
                          className="w-20 rounded border border-white/20 bg-zinc-800 px-2 py-1 text-white text-xs text-center focus:border-orange-500 focus:outline-none"
                        />
                      ) : match.result ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                            match.result.split("-")[0].trim() > match.result.split("-")[1]?.trim()
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {match.result}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600 italic">—</span>
                      )}
                    </td>

                    {/* Próximo */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleNextMatch(match)}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                          match.is_next_match
                            ? "bg-orange-500 text-black"
                            : "bg-white/5 border border-white/10 text-zinc-500 hover:text-white hover:bg-white/10"
                        }`}
                        title={
                          match.is_next_match
                            ? "Quitar como próximo"
                            : "Marcar como próximo"
                        }
                      >
                        {match.is_next_match ? (
                          <Star className="w-4 h-4 fill-current" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveInlineEdit(match)}
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
                              onClick={() => handleEdit(match)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                              title="Formulario completo"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => startInlineEdit(match)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-zinc-400 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                              title="Edición rápida"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button
                              onClick={() => setViewMatch(match)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                              title="Ver detalle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(match.id)}
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

      {viewMatch && (
        <MatchDetailModal
          match={viewMatch}
          onClose={() => setViewMatch(null)}
        />
      )}
    </div>
  );
}
