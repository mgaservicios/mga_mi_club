import { getTeam } from "@/features/team/actions";
import { getPlayers } from "@/features/players/actions";
import AdminPlayersClient from "./admin-players-client";

export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  const team = await getTeam();

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Primero configura tu equipo</h2>
        <p className="text-zinc-400 max-w-md">
          Debes registrar la información de tu equipo en la sección "Equipo" antes de poder gestionar los jugadores.
        </p>
      </div>
    );
  }

  const players = await getPlayers(team.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Jugadores y Cuerpo Técnico
        </h1>
        <p className="text-zinc-400 mt-1">
          Administra la plantilla de jugadores, entrenadores y sus estadísticas.
        </p>
      </div>

      <AdminPlayersClient teamId={team.id} initialPlayers={players} />
    </div>
  );
}
