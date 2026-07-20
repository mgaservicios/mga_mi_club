"use client";

import { useState } from "react";
import { GalleryImage, GalleryInput } from "../types";
import { createGalleryImage, updateGalleryImage } from "../actions";
import { Album } from "../album-types";
import ImageUpload from "@/features/team/components/image-upload";

interface GalleryFormProps {
  teamId: string;
  image?: GalleryImage | null;
  albums: Album[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function GalleryForm({
  teamId,
  image,
  albums,
  onSuccess,
  onCancel,
}: GalleryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(image?.title || "");
  const [imageUrl, setImageUrl] = useState(image?.image_url || "");
  const [description, setDescription] = useState(image?.description || "");
  const [albumId, setAlbumId] = useState(image?.album_id || "");
  const [photoDate, setPhotoDate] = useState(image?.photo_date || "");
  const [location, setLocation] = useState(image?.location || "");
  const [sortOrder, setSortOrder] = useState<number>(image?.sort_order || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Debes subir una imagen");
      return;
    }

    setLoading(true);
    setError(null);

    // Obtener el nombre del álbum para compatibilidad legacy
    const selectedAlbum = albums.find((a) => a.id === albumId);
    const albumName = selectedAlbum ? selectedAlbum.name : "general";

    const input: GalleryInput = {
      team_id: teamId,
      title,
      image_url: imageUrl,
      description: description || null,
      album: albumName,
      album_id: albumId || null,
      photo_date: photoDate || null,
      location: location || null,
      sort_order: sortOrder,
    };

    try {
      if (image) {
        await updateGalleryImage(image.id, input);
      } else {
        await createGalleryImage(input);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al guardar la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111]/50 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          {image ? "Editar Foto" : "Agregar Foto"}
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
        {/* Imagen */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300">Imagen *</label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="gallery"
          />
        </div>

        {/* Título */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="photoTitle" className="block text-sm font-medium text-zinc-300">
            Título *
          </label>
          <input
            id="photoTitle"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Festejo del campeonato"
          />
        </div>

        {/* Álbum */}
        <div className="space-y-2">
          <label htmlFor="photoAlbum" className="block text-sm font-medium text-zinc-300">
            Álbum
          </label>
          <select
            id="photoAlbum"
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          >
            <option value="">Seleccionar álbum</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Orden */}
        <div className="space-y-2">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-zinc-300">
            Orden de Visualización
          </label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <label htmlFor="photoDate" className="block text-sm font-medium text-zinc-300">
            Fecha de la Foto
          </label>
          <input
            id="photoDate"
            type="date"
            value={photoDate}
            onChange={(e) => setPhotoDate(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          />
        </div>

        {/* Ubicación */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-zinc-300">
            Ubicación
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Gimnasio Municipal, Neuquén"
          />
        </div>

        {/* Descripción */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="photoDesc" className="block text-sm font-medium text-zinc-300">
            Descripción (Opcional)
          </label>
          <input
            id="photoDesc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Foto grupal con el trofeo..."
          />
        </div>
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
