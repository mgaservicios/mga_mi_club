"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Team } from "../types";
import { createTeam, updateTeam } from "../actions";
import ImageUpload from "./image-upload";

interface TeamFormProps {
  team: Team | null;
}

export default function TeamForm({ team }: TeamFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(team?.name || "");
  const [logoUrl, setLogoUrl] = useState(team?.logo_url || "");
  const [city, setCity] = useState(team?.city || "");
  const [description, setDescription] = useState(team?.description || "");
  const [history, setHistory] = useState(team?.history || "");
  const [primaryColor, setPrimaryColor] = useState(team?.primary_color || "#000000");
  const [secondaryColor, setSecondaryColor] = useState(team?.secondary_color || "#ffffff");
  const [instagramUrl, setInstagramUrl] = useState(team?.instagram_url || "");
  const [facebookUrl, setFacebookUrl] = useState(team?.facebook_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const input = {
      name,
      logo_url: logoUrl || null,
      city: city || null,
      description: description || null,
      history: history || null,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      instagram_url: instagramUrl || null,
      facebook_url: facebookUrl || null,
    };

    try {
      if (team) {
        await updateTeam(team.id, input);
      } else {
        await createTeam(input);
      }
      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Error al guardar la información del equipo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-[#111111]/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Información del Equipo</h2>
        <p className="text-sm text-zinc-400">Configura los datos principales de tu club.</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/50 border border-red-500 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-900/50 border border-green-500 p-4 text-sm text-green-200">
          ¡Información guardada con éxito!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">Logo del Equipo</label>
          <ImageUpload
            value={logoUrl}
            onChange={setLogoUrl}
            folder="logos"
            circular
          />
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
            Nombre del Equipo *
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Street Dogs"
          />
        </div>

        {/* Ciudad */}
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-zinc-300">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Neuquén, Patagonia"
          />
        </div>

        {/* Descripción */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
            Descripción Corta
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Club de Básquet +40 de la Patagonia"
          />
        </div>

        {/* Historia */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="history" className="block text-sm font-medium text-zinc-300">
            Nuestra Historia
          </label>
          <textarea
            id="history"
            rows={6}
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Escribe la historia del club aquí..."
          />
        </div>

        {/* Color Primario */}
        <div className="space-y-2">
          <label htmlFor="primaryColor" className="block text-sm font-medium text-zinc-300">
            Color Primario
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Color Secundario */}
        <div className="space-y-2">
          <label htmlFor="secondaryColor" className="block text-sm font-medium text-zinc-300">
            Color Secundario
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="space-y-2">
          <label htmlFor="instagramUrl" className="block text-sm font-medium text-zinc-300">
            Instagram URL
          </label>
          <input
            id="instagramUrl"
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="https://instagram.com/streetdogs"
          />
        </div>

        {/* Facebook */}
        <div className="space-y-2">
          <label htmlFor="facebookUrl" className="block text-sm font-medium text-zinc-300">
            Facebook URL
          </label>
          <input
            id="facebookUrl"
            type="url"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="https://facebook.com/streetdogs"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </form>
  );
}
