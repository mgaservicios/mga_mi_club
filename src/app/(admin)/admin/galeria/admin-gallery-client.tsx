"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryImage } from "@/features/gallery/types";
import { Album } from "@/features/gallery/album-types";
import { deleteGalleryImage } from "@/features/gallery/actions";
import { createAlbum, deleteAlbum } from "@/features/gallery/album-actions";
import GalleryForm from "@/features/gallery/components/gallery-form";
import ImageLightbox from "@/components/image-lightbox";
import { Plus, Edit2, Trash2, Image as ImageIcon, FolderPlus, FolderMinus, Calendar, MapPin } from "lucide-react";
import Image from "next/image";

interface AdminGalleryClientProps {
  teamId: string;
  initialImages: GalleryImage[];
  initialAlbums: Album[];
}

export default function AdminGalleryClient({
  teamId,
  initialImages,
  initialAlbums,
}: AdminGalleryClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lightboxSrc, setLightboxUrl] = useState<string | null>(null);

  // Estado para creación de álbumes
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [albumLoading, setAlbumLoading] = useState(false);

  const handleEdit = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedImage(null);
    setIsEditing(true);
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta foto?")) {
      try {
        await deleteGalleryImage(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar la foto");
      }
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName) return;

    setAlbumLoading(true);
    try {
      await createAlbum({
        team_id: teamId,
        name: newAlbumName,
        description: newAlbumDesc || null,
      });
      setNewAlbumName("");
      setNewAlbumDesc("");
      setShowAlbumForm(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error al crear el álbum");
    } finally {
      setAlbumLoading(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este álbum? Las fotos asociadas quedarán sin álbum.")) {
      try {
        await deleteAlbum(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar el álbum");
      }
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setSelectedImage(null);
    router.refresh();
  };

  const getAlbumName = (id: string | null) => {
    if (!id) return "General";
    return initialAlbums.find((a) => a.id === id)?.name || "General";
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Sección de Álbumes */}
      {!isEditing && (
        <div className="bg-[#111111]/30 border border-white/5 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-orange-500" />
              <span>Álbumes de Fotos</span>
            </h3>
            <button
              onClick={() => setShowAlbumForm(!showAlbumForm)}
              className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 font-semibold transition-colors"
            >
              {showAlbumForm ? "Cancelar" : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  <span>Nuevo Álbum</span>
                </>
              )}
            </button>
          </div>

          {showAlbumForm && (
            <form onSubmit={handleCreateAlbum} className="bg-[#111111]/50 border border-white/10 rounded-lg p-4 space-y-4 max-w-md">
              <div className="space-y-2">
                <label htmlFor="albumName" className="block text-xs font-medium text-zinc-300">Nombre del Álbum *</label>
                <input
                  id="albumName"
                  type="text"
                  required
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none sm:text-sm"
                  placeholder="Temporada 2026"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="albumDesc" className="block text-xs font-medium text-zinc-300">Descripción</label>
                <input
                  id="albumDesc"
                  type="text"
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none sm:text-sm"
                  placeholder="Fotos de los partidos de la temporada"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAlbumForm(false)}
                  className="px-3 py-1.5 border border-white/10 hover:bg-white/5 text-white text-xs rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={albumLoading}
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  {albumLoading ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-wrap gap-3">
            {initialAlbums.length === 0 ? (
              <span className="text-xs text-zinc-500 italic">No hay álbumes creados. Las fotos se guardarán en "General".</span>
            ) : (
              initialAlbums.map((album) => (
                <div
                  key={album.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                >
                  <span>{album.name}</span>
                  <button
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Eliminar álbum"
                  >
                    <FolderMinus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sección de Fotos */}
      <div className="space-y-6">
        {!isEditing && (
          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Foto</span>
            </button>
          </div>
        )}

        {isEditing ? (
          <GalleryForm
            teamId={teamId}
            image={selectedImage}
            albums={initialAlbums}
            onSuccess={handleSuccess}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {initialImages.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-[#111111]/30 rounded-xl border border-white/5 text-zinc-500">
                No hay fotos registradas en la galería.
              </div>
            ) : (
              initialImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-[#111111]/50 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all group"
                >
                  <div
                    className="relative aspect-video w-full overflow-hidden bg-zinc-900 cursor-pointer"
                    onClick={() => setLightboxUrl(img.image_url)}
                  >
                    <Image
                      src={img.image_url}
                      alt={img.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] font-semibold text-orange-500 border border-orange-500/20">
                      {getAlbumName(img.album_id)}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm truncate mb-1">{img.title}</h4>
                      {img.description && (
                        <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{img.description}</p>
                      )}
                      <div className="space-y-1">
                        {img.photo_date && (
                          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(img.photo_date)}</span>
                          </div>
                        )}
                        {img.location && (
                          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{img.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4 pt-3 border-t border-white/5">
                      <button
                        onClick={() => handleEdit(img)}
                        className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxUrl(null)} />
      )}
    </div>
  );
}
