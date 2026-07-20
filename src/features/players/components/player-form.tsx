"use client";

import { useState } from "react";
import { Player, PlayerInput, PlayerRole, Position } from "../types";
import { createPlayer, updatePlayer } from "../actions";
import { PLAYER_ROLES, POSITIONS } from "../constants";
import ImageUpload from "@/features/team/components/image-upload";

interface PlayerFormProps {
  teamId: string;
  player?: Player | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PlayerForm({ teamId, player, onSuccess, onCancel }: PlayerFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(player?.name || "");
  const [photoUrl, setPhotoUrl] = useState(player?.photo_url || "");
  const [number, setNumber] = useState<number | "">(player?.number !== undefined && player?.number !== null ? player.number : "");
  const [role, setRole] = useState<PlayerRole>(player?.role || "player");
  const [position, setPosition] = useState<Position | "">(player?.position || "");
  const [birthDate, setBirthDate] = useState(player?.birth_date || "");
  const [birthplace, setBirthplace] = useState(player?.birthplace || "");
  const [heightCm, setHeightCm] = useState<number | "">(player?.height_cm !== undefined && player?.height_cm !== null ? player.height_cm : "");
  const [phone, setPhone] = useState(player?.phone || "");
  const [email, setEmail] = useState(player?.email || "");
  const [previousClubs, setPreviousClubs] = useState(player?.previous_clubs || "");
  const [bio, setBio] = useState(player?.bio || "");

  // Estadísticas
  const [points, setPoints] = useState<number>(player?.points || 0);
  const [rebounds, setRebounds] = useState<number>(player?.rebounds || 0);
  const [assists, setAssists] = useState<number>(player?.assists || 0);
  const [steals, setSteals] = useState<number>(player?.steals || 0);
  const [minutes, setMinutes] = useState<number>(player?.minutes || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: PlayerInput = {
      team_id: teamId,
      name,
      photo_url: photoUrl || null,
      number: number !== "" ? Number(number) : null,
      role,
      position: role === "player" && position !== "" ? (position as Position) : null,
      birth_date: birthDate || null,
      birthplace: birthplace || null,
      height_cm: heightCm !== "" ? Number(heightCm) : null,
      phone: phone || null,
      email: email || null,
      previous_clubs: previousClubs || null,
      bio: bio || null,
      points: role === "player" ? points : 0,
      rebounds: role === "player" ? rebounds : 0,
      assists: role === "player" ? assists : 0,
      steals: role === "player" ? steals : 0,
      minutes: role === "player" ? minutes : 0,
    };

    try {
      if (player) {
        await updatePlayer(player.id, input);
      } else {
        await createPlayer(input);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al guardar el jugador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111]/50 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          {player ? "Editar Miembro" : "Agregar Miembro"}
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
        {/* Foto */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">Foto de Perfil</label>
          <ImageUpload
            value={photoUrl}
            onChange={setPhotoUrl}
            folder="players"
            circular
          />
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <label htmlFor="playerName" className="block text-sm font-medium text-zinc-300">
            Nombre Completo *
          </label>
          <input
            id="playerName"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Juan Pérez"
          />
        </div>

        {/* Rol */}
        <div className="space-y-2">
          <label htmlFor="playerRole" className="block text-sm font-medium text-zinc-300">
            Rol *
          </label>
          <select
            id="playerRole"
            value={role}
            onChange={(e) => setRole(e.target.value as PlayerRole)}
            className="block w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          >
            {PLAYER_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {role === "player" && (
          <>
            {/* Número de Camiseta */}
            <div className="space-y-2">
              <label htmlFor="playerNumber" className="block text-sm font-medium text-zinc-300">
                Número de Camiseta
              </label>
              <input
                id="playerNumber"
                type="number"
                min={0}
                max={99}
                value={number}
                onChange={(e) => setNumber(e.target.value !== "" ? Number(e.target.value) : "")}
                className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
                placeholder="10"
              />
            </div>

            {/* Posición */}
            <div className="space-y-2">
              <label htmlFor="playerPosition" className="block text-sm font-medium text-zinc-300">
                Posición
              </label>
              <select
                id="playerPosition"
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="block w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
              >
                <option value="">Seleccionar posición</option>
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Fecha de Nacimiento */}
        <div className="space-y-2">
          <label htmlFor="birthDate" className="block text-sm font-medium text-zinc-300">
            Fecha de Nacimiento
          </label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Lugar de Nacimiento */}
        <div className="space-y-2">
          <label htmlFor="birthplace" className="block text-sm font-medium text-zinc-300">
            Lugar de Nacimiento
          </label>
          <input
            id="birthplace"
            type="text"
            value={birthplace}
            onChange={(e) => setBirthplace(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Neuquén"
          />
        </div>

        {/* Altura */}
        <div className="space-y-2">
          <label htmlFor="heightCm" className="block text-sm font-medium text-zinc-300">
            Altura (cm)
          </label>
          <input
            id="heightCm"
            type="number"
            min={0}
            max={250}
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value !== "" ? Number(e.target.value) : "")}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="185"
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-300">
            Teléfono de Contacto
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="+54 299 123456"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="jugador@miclub.com"
          />
        </div>

        {/* Clubes Anteriores */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="previousClubs" className="block text-sm font-medium text-zinc-300">
            Clubes Anteriores
          </label>
          <textarea
            id="previousClubs"
            rows={2}
            value={previousClubs}
            onChange={(e) => setPreviousClubs(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Club A (2018-2020), Club B (2020-2022)"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="bio" className="block text-sm font-medium text-zinc-300">
            Biografía / Notas
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Breve descripción o trayectoria..."
          />
        </div>

        {/* Estadísticas (Solo Jugadores) */}
        {role === "player" && (
          <div className="md:col-span-2 border-t border-white/10 pt-6 space-y-4">
            <h4 className="text-md font-bold text-white">Estadísticas Acumuladas</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="space-y-1">
                <label htmlFor="points" className="block text-xs font-medium text-zinc-400">PTS (Puntos)</label>
                <input
                  id="points"
                  type="number"
                  min={0}
                  value={points}
                  onChange={(e) => setPoints(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-orange-500 focus:outline-none sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="rebounds" className="block text-xs font-medium text-zinc-400">REB (Rebotes)</label>
                <input
                  id="rebounds"
                  type="number"
                  min={0}
                  value={rebounds}
                  onChange={(e) => setRebounds(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-orange-500 focus:outline-none sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="assists" className="block text-xs font-medium text-zinc-400">AST (Asistencias)</label>
                <input
                  id="assists"
                  type="number"
                  min={0}
                  value={assists}
                  onChange={(e) => setAssists(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-orange-500 focus:outline-none sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="steals" className="block text-xs font-medium text-zinc-400">ROB (Robos)</label>
                <input
                  id="steals"
                  type="number"
                  min={0}
                  value={steals}
                  onChange={(e) => setSteals(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-orange-500 focus:outline-none sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="minutes" className="block text-xs font-medium text-zinc-400">MIN (Minutos)</label>
                <input
                  id="minutes"
                  type="number"
                  min={0}
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Number(e.target.value)))}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-orange-500 focus:outline-none sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
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
