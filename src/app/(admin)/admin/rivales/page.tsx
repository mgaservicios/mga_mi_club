import { getTeam } from "@/features/team/actions";
import { getRivals } from "@/features/rivals/actions";
import AdminRivalsClient from "./admin-rivals-client";

export const dynamic = "force-dynamic";

export default async function AdminRivalesPage() {
  const team = await getTeam();

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Primero configura tu equipo</h2>
        <p className="text-zinc-400 max-w-md">
          Debes registrar la información de tu equipo en la sección &quot;Equipo&quot; antes de poder gestionar los rivales.
        </p>
      </div>
    );
  }

  const rivals = await getRivals(team.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Gestión de Rivales
        </h1>
        <p className="text-zinc-400 mt-1">
          Administra los equipos rivales contra los que juega tu club.
        </p>
      </div>

      <AdminRivalsClient teamId={team.id} initialRivals={rivals} />
    </div>
  );
}
