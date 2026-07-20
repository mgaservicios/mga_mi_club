import { getTeam } from "@/features/team/actions";
import TeamForm from "@/features/team/components/team-form";

export const dynamic = "force-dynamic";

export default async function AdminEquipoPage() {
  const team = await getTeam();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Gestión del Equipo
        </h1>
        <p className="text-zinc-400 mt-1">
          Administra la identidad visual y la información general de tu club.
        </p>
      </div>

      <TeamForm team={team} />
    </div>
  );
}
