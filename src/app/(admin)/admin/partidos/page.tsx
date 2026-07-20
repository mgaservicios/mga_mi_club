import { getTeam } from "@/features/team/actions";
import { getMatches } from "@/features/matches/actions";
import { getChampionships } from "@/features/championships/actions";
import { getRivals } from "@/features/rivals/actions";
import AdminMatchesClient from "./admin-matches-client";

export const dynamic = "force-dynamic";

export default async function AdminPartidosPage() {
  const team = await getTeam();

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Primero configura tu equipo</h2>
        <p className="text-zinc-400 max-w-md">
          Debes registrar la información de tu equipo en la sección "Equipo" antes de poder gestionar los partidos.
        </p>
      </div>
    );
  }

  const matches = await getMatches(team.id);
  const championships = await getChampionships(team.id);
  const rivals = await getRivals(team.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Gestión de Partidos
        </h1>
        <p className="text-zinc-400 mt-1">
          Administra el calendario de partidos, resultados, crónicas y destaca el próximo encuentro.
        </p>
      </div>

      <AdminMatchesClient
        teamId={team.id}
        initialMatches={matches}
        championships={championships}
        rivals={rivals}
      />
    </div>
  );
}
