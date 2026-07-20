"use client";

import { useState } from "react";
import { Standing, StandingInput } from "../types";
import { createStanding, updateStanding } from "../actions";
import { Championship } from "@/features/championships/types";

interface StandingsFormProps {
  teamId: string;
  standing?: Standing | null;
  championships: Championship[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function StandingsForm({
  teamId,
  standing,
  championships,
  onSuccess,
  onCancel,
}: StandingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [teamName, setTeamName] = useState(standing?.team_name || "");
  const [played, setPlayed] = useState<number>(standing?.played || 0);
  const [won, setWon] = useState<number>(standing?.won || 0);
  const [lost, setLost] = useState<number>(standing?.lost || 0);
  const [points, setPoints] = useState<number>(standing?.points || 0);
  const [position, setPosition] = useState<number>(standing?.position || 1);
  const [championshipId, setChampionshipId] = useState(standing?.championship_id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: StandingInput = {
      team_id: teamId,
      team_name: teamName,
      played,
      won,
      lost,
      points,
      position,
      championship_id: championshipId || null,
    };

    try {
      if (standing) {
        await updateStanding(standing.id, input);
      } else {
        await createStanding(input);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al guardar la clasificación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111]/50 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          {standing ? "Editar Fila de Clasificación" : "Agregar Fila de Clasificación"}
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
        {/* Nombre del Equipo */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="standingTeamName" className="block text-sm font-medium text-zinc-300">
            Nombre del Equipo *
          </label>
          <input
            id="standingTeamName"
            type="text"
            required
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Street Dogs"
          />
        </div>

        {/* Campeonato */}
        <div className="space-y-2">
          <label htmlFor="standingChampionship" className="block text-sm font-medium text-zinc-300">
            Campeonato
          </label>
          <select
            id="standingChampionship"
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

        {/* Posición */}
        <div className="space-y-2">
          <label htmlFor="position" className="block text-sm font-medium text-zinc-300">
            Posición en la Tabla
          </label>
          <input
            id="position"
            type="number"
            min={1}
            required
            value={position}
            onChange={(e) => setPosition(Math.max(1, Number(e.target.value)))}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Partidos Jugados */}
        <div className="space-y-2">
          <label htmlFor="played" className="block text-sm font-medium text-zinc-300">
            Partidos Jugados (PJ)
          </label>
          <input
            id="played"
            type="number"
            min={0}
            value={played}
            onChange={(e) => setPlayed(Math.max(0, Number(e.target.value)))}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Partidos Ganados */}
        <div className="space-y-2">
          <label htmlFor="won" className="block text-sm font-medium text-zinc-300">
            Partidos Ganados (PG)
          </label>
          <input
            id="won"
            type="number"
            min={0}
            value={won}
            onChange={(e) => setWon(Math.max(0, Number(e.target.value)))}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Partidos Perdidos */}
        <div className="space-y-2">
          <label htmlFor="lost" className="block text-sm font-medium text-zinc-300">
            Partidos Perdidos (PP)
          </label>
          <input
            id="lost"
            type="number"
            min={0}
            value={lost}
            onChange={(e) => setLost(Math.max(0, Number(e.target.value)))}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Puntos */}
        <div className="space-y-2">
          <label htmlFor="points" className="block text-sm font-medium text-zinc-300">
            Puntos Totales (PTS)
          </label>
          <input
            id="points"
            type="number"
            min={0}
            value={points}
            onChange={(e) => setPoints(Math.max(0, Number(e.target.value)))}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
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
