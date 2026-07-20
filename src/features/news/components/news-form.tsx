"use client";

import { useState } from "react";
import { News, NewsInput } from "../types";
import { createNews, updateNews } from "../actions";
import ImageUpload from "@/features/team/components/image-upload";

interface NewsFormProps {
  teamId: string;
  news?: News | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function NewsForm({ teamId, news, onSuccess, onCancel }: NewsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(news?.title || "");
  const [content, setContent] = useState(news?.content || "");
  const [imageUrl, setImageUrl] = useState(news?.image_url || "");
  const [published, setPublished] = useState(news?.published !== undefined ? news.published : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: NewsInput = {
      team_id: teamId,
      title,
      content,
      image_url: imageUrl || null,
      published,
    };

    try {
      if (news) {
        await updateNews(news.id, input);
      } else {
        await createNews(input);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al guardar la noticia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#111111]/50 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          {news ? "Editar Noticia" : "Agregar Noticia"}
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

      <div className="grid grid-cols-1 gap-6">
        {/* Imagen */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-300">Imagen Destacada</label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="news"
          />
        </div>

        {/* Título */}
        <div className="space-y-2">
          <label htmlFor="newsTitle" className="block text-sm font-medium text-zinc-300">
            Título *
          </label>
          <input
            id="newsTitle"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="¡Gran victoria en el clásico de la Patagonia!"
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <label htmlFor="newsStatus" className="block text-sm font-medium text-zinc-300">
            Estado de Publicación *
          </label>
          <select
            id="newsStatus"
            value={published ? "true" : "false"}
            onChange={(e) => setPublished(e.target.value === "true")}
            className="block w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
          >
            <option value="true">Publicado</option>
            <option value="false">Borrador</option>
          </select>
        </div>

        {/* Contenido */}
        <div className="space-y-2">
          <label htmlFor="newsContent" className="block text-sm font-medium text-zinc-300">
            Contenido *
          </label>
          <textarea
            id="newsContent"
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 sm:text-sm"
            placeholder="Escribe el cuerpo de la noticia aquí..."
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
