import { getTeam } from "@/features/team/actions";
import { getGallery } from "@/features/gallery/actions";
import { getAlbums } from "@/features/gallery/album-actions";
import AdminGalleryClient from "./admin-gallery-client";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  const team = await getTeam();

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Primero configura tu equipo</h2>
        <p className="text-zinc-400 max-w-md">
          Debes registrar la información de tu equipo en la sección "Equipo" antes de poder gestionar la galería.
        </p>
      </div>
    );
  }

  const images = await getGallery(team.id);
  const albums = await getAlbums(team.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Galería de Fotos
        </h1>
        <p className="text-zinc-400 mt-1">
          Organiza las fotos del club por álbumes y gestiona los recuerdos de tu equipo.
        </p>
      </div>

      <AdminGalleryClient
        teamId={team.id}
        initialImages={images}
        initialAlbums={albums}
      />
    </div>
  );
}
