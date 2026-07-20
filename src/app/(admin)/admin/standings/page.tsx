import { getTeam } from "@/features/team/actions";
import { getStandings } from "@/features/standings/actions";
import { getChampionships } from "@/features/championships/actions";
import AdminStandingsClient from "./admin-standings-client";

export const dynamic = "force-dynamic";

export default async function AdminStandingsPage() {
  const team = await getTeam();

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Primero configura tu equipo</h2>
        <p className="text-zinc-400 max-w-md">
          Debes registrar la información de tu equipo en la sección "Equipo" antes de poder gestionar la clasificación.
        </p>
      </div>
    );
  }

  const standings = await getStandings(team.id);
  const championships = await getChampionships(team.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Tabla de Posiciones
        </h1>
        <p className="text-zinc-400 mt-1">
          Administra la tabla de clasificación de los campeonatos en los que participa tu club.
        </p>
      </div>

      <AdminStandingsClient
        teamId={team.id}
        initialStandings={standings}
        championships={championships}
      />
    </div>
  );
}
