import { getTeam } from "@/features/team/actions";
import { getAllNews } from "@/features/news/actions";
import AdminNewsClient from "./admin-news-client";

export const dynamic = "force-dynamic";

export default async function AdminNoticiasPage() {
  const team = await getTeam();

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Primero configura tu equipo</h2>
        <p className="text-zinc-400 max-w-md">
          Debes registrar la información de tu equipo en la sección "Equipo" antes de poder gestionar las noticias.
        </p>
      </div>
    );
  }

  const news = await getAllNews(team.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Gestión de Noticias
        </h1>
        <p className="text-zinc-400 mt-1">
          Publica novedades, crónicas de partidos y comunicados oficiales del club.
        </p>
      </div>

      <AdminNewsClient teamId={team.id} initialNews={news} />
    </div>
  );
}
