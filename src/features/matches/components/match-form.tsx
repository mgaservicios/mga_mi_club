"use client";

import { useState } from "react";
import { Match, MatchInput } from "../types";
import { createMatch, updateMatch } from "../actions";
import { Championship } from "@/features/championships/types";
import { Rival } from "@/features/rivals/types";
import ImageUpload from "@/features/team/components/image-upload";

interface MatchFormProps {
  teamId: string;
  match?: Match | null;
  championships: Championship[];
  rivals: Rival[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MatchForm({
  teamId,
  match,
  championships,
  rivals,
  onSuccess,
  onCancel,
}: MatchFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rivalId, setRivalId] = useState(match?.rival_id || "");
  const [rivalName, setRivalName] = useState(match?.rival || "");
  // Convertir fecha ISO a formato datetime-local (YYYY-MM-DDTHH:MM)
  const formatISOToDatetimeLocal = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000; // offset en ms
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [date, setDate] = useState(formatISOToDatetimeLocal(match?.date));
  const [matchday, setMatchday] = useState(match?.matchday?.toString() || "");
  const [isHome, setIsHome] = useState(match?.is_home !== undefined ? match.is_home : true);
  const [championshipId, setChampionshipId] = useState(match?.championship_id || "");
  const [imageUrl, setImageUrl] = useState(match?.image_url || "");
  const [result, setResult] = useState(match?.result || "");
  const [summary, setSummary] = useState(match?.summary || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedRival = rivals.find(r => r.id === rivalId);
    const rivalDisplayName = selectedRival ? selectedRival.name : rivalName;

    const input: MatchInput = {
      team_id: teamId,
      rival: rivalDisplayName,
      rival_id: rivalId || null,
      date: new Date(date).toISOString(),
      matchday: matchday ? parseInt(matchday) : null,
      is_home: isHome,
      championship_id: championshipId || null,
      image_url: imageUrl || null,
      result: result || null,
      summary: summary || null,
    };

    try {
      if (match) {
        await updateMatch(match.id, input);
      } else {
        await createMatch(input);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al guardar el partido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111]/50 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          {match ? "Editar Partido" : "Agregar Partido"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Cancelar
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/50 border border-red-500 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagen */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">Imagen del Partido</label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="matches"
          />
        </div>

        {/* Rival */}
        <div className="space-y-2">
          <label htmlFor="rival" className="block text-sm font-medium text-zinc-300">
            Rival *
          </label>
          <select
            id="rival"
            value={rivalId}
            onChange={(e) => setRivalId(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          >
            <option value="">Seleccionar rival</option>
            {rivals.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}{r.location ? ` (${r.location})` : ""}
              </option>
            ))}
            <option value="otro">Otro (escribir manualmente)</option>
          </select>
        </div>

        {rivalId === "otro" && (
          <div className="space-y-2">
            <label htmlFor="rivalManual" className="block text-sm font-medium text-zinc-300">
              Nombre del Rival *
            </label>
            <input
              id="rivalManual"
              type="text"
              required
              value={rivalName}
              onChange={(e) => setRivalName(e.target.value)}
              className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
              placeholder="Zorros de San Martín"
            />
          </div>
        )}

        {/* Fecha y Hora */}
        <div className="space-y-2">
          <label htmlFor="matchDate" className="block text-sm font-medium text-zinc-300">
            Fecha y Hora *
          </label>
          <input
            id="matchDate"
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Condición */}
        <div className="space-y-2">
          <label htmlFor="condition" className="block text-sm font-medium text-zinc-300">
            Condición *
          </label>
          <select
            id="condition"
            value={isHome ? "true" : "false"}
            onChange={(e) => setIsHome(e.target.value === "true")}
            className="block w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          >
            <option value="true">Local</option>
            <option value="false">Visitante</option>
          </select>
        </div>

        {/* Campeonato */}
        <div className="space-y-2">
          <label htmlFor="matchChampionship" className="block text-sm font-medium text-zinc-300">
            Campeonato
          </label>
          <select
            id="matchChampionship"
            value={championshipId}
            onChange={(e) => setChampionshipId(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          >
            <option value="">Seleccionar campeonato</option>
            {championships.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Resultado */}
        <div className="space-y-2">
          <label htmlFor="result" className="block text-sm font-medium text-zinc-300">
            Resultado (Opcional)
          </label>
          <input
            id="result"
            type="text"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="85-78"
          />
        </div>

        {/* Nro de Fecha */}
        <div className="space-y-2">
          <label htmlFor="matchday" className="block text-sm font-medium text-zinc-300">
            Nro de Fecha (Opcional)
          </label>
          <input
            id="matchday"
            type="number"
            min="1"
            value={matchday}
            onChange={(e) => setMatchday(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="1"
          />
        </div>

        {/* Resumen */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="summary" className="block text-sm font-medium text-zinc-300">
            Resumen del Partido (Opcional)
          </label>
          <textarea
            id="summary"
            rows={4}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Escribe una crónica o resumen del partido..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
