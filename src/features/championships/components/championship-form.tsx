"use client";

import { useState } from "react";
import { Championship, ChampionshipInput } from "../types";
import { createChampionship, updateChampionship } from "../actions";
import ImageUpload from "@/features/team/components/image-upload";

interface ChampionshipFormProps {
  teamId: string;
  championship?: Championship | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ChampionshipForm({
  teamId,
  championship,
  onSuccess,
  onCancel,
}: ChampionshipFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(championship?.name || "");
  const [organizer, setOrganizer] = useState(championship?.organizer || "");
  const [startDate, setStartDate] = useState(championship?.start_date || "");
  const [endDate, setEndDate] = useState(championship?.end_date || "");
  const [logoUrl, setLogoUrl] = useState(championship?.logo_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: ChampionshipInput = {
      team_id: teamId,
      name,
      organizer: organizer || null,
      start_date: startDate || null,
      end_date: endDate || null,
      logo_url: logoUrl || null,
    };

    try {
      if (championship) {
        await updateChampionship(championship.id, input);
      } else {
        await createChampionship(input);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al guardar el campeonato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111]/50 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          {championship ? "Editar Campeonato" : "Agregar Campeonato"}
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
        {/* Logo */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">Logo del Torneo</label>
          <ImageUpload
            value={logoUrl}
            onChange={setLogoUrl}
            folder="championships"
          />
        </div>

        {/* Nombre */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="champName" className="block text-sm font-medium text-zinc-300">
            Nombre del Campeonato *
          </label>
          <input
            id="champName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Torneo Apertura 2026"
          />
        </div>

        {/* Organizador */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="organizer" className="block text-sm font-medium text-zinc-300">
            Organizador
          </label>
          <input
            id="organizer"
            type="text"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Federación de Básquet de Neuquén"
          />
        </div>

        {/* Fecha de Inicio */}
        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium text-zinc-300">
            Fecha de Inicio
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Fecha de Fin */}
        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium text-zinc-300">
            Fecha de Fin
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
