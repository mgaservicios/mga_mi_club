"use client";

import { useState } from "react";
import { Rival, RivalInput } from "../types";
import { createRival, updateRival } from "../actions";
import ImageUpload from "@/features/team/components/image-upload";

interface RivalFormProps {
  teamId: string;
  rival?: Rival | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RivalForm({ teamId, rival, onSuccess, onCancel }: RivalFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(rival?.name || "");
  const [location, setLocation] = useState(rival?.location || "");
  const [logoUrl, setLogoUrl] = useState(rival?.logo_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: RivalInput = {
      team_id: teamId,
      name,
      location: location || null,
      logo_url: logoUrl || null,
    };

    try {
      if (rival) {
        await updateRival(rival.id, input);
      } else {
        await createRival(input);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al guardar el rival");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111]/50 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          {rival ? "Editar Rival" : "Agregar Rival"}
        </h3>
        <button type="button" onClick={onCancel} className="text-sm text-zinc-400 hover:text-white">
          Cancelar
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/50 border border-red-500 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">Logo del Rival</label>
          <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="rivals" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="rivalName" className="block text-sm font-medium text-zinc-300">
            Nombre del Equipo *
          </label>
          <input
            id="rivalName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Blackhawks, Halcones, etc."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="rivalLocation" className="block text-sm font-medium text-zinc-300">
            Localidad
          </label>
          <input
            id="rivalLocation"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Rada Tilly, Comodoro Rivadavia, etc."
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
