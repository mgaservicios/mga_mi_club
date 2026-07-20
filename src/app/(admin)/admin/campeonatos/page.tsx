import { getTeam } from "@/features/team/actions";
import { getChampionships } from "@/features/championships/actions";
import AdminChampionshipsClient from "./admin-championships-client";

export const dynamic = "force-dynamic";

export default async function AdminCampeonatosPage() {
  const team = await getTeam();

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Primero configura tu equipo</h2>
        <p className="text-zinc-400 max-w-md">
          Debes registrar la información de tu equipo en la sección "Equipo" antes de poder gestionar los campeonatos.
        </p>
      </div>
    );
  }

  const championships = await getChampionships(team.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Gestión de Campeonatos
        </h1>
        <p className="text-zinc-400 mt-1">
          Administra los torneos y ligas en los que participa tu club.
        </p>
      </div>

      <AdminChampionshipsClient teamId={team.id} initialChampionships={championships} />
    </div>
  );
}
