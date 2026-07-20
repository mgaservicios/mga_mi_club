"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { News } from "@/features/news/types";
import { deleteNews } from "@/features/news/actions";
import NewsForm from "@/features/news/components/news-form";
import { Plus, Edit2, Trash2, Calendar, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface AdminNewsClientProps {
  teamId: string;
  initialNews: News[];
}

export default function AdminNewsClient({ teamId, initialNews }: AdminNewsClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const handleEdit = (news: News) => {
    setSelectedNews(news);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedNews(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta noticia?")) {
      try {
        await deleteNews(id);
        router.refresh();
      } catch (err: any) {
        alert(err.message || "Error al eliminar la noticia");
      }
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setSelectedNews(null);
    router.refresh();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Argentina/Buenos_Aires",
    });
  };

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Noticia</span>
          </button>
        </div>
      )}

      {isEditing ? (
        <NewsForm
          teamId={teamId}
          news={selectedNews}
          onSuccess={handleSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialNews.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-[#111111]/30 rounded-xl border border-white/5 text-zinc-500">
              No hay noticias registradas.
            </div>
          ) : (
            initialNews.map((news) => (
              <div
                key={news.id}
                className="bg-[#111111]/50 border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(news.created_at)}</span>
                    </div>
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${news.published
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                    >
                      {news.published ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Publicado</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Borrador</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-3 line-clamp-2">{news.title}</h4>

                  {news.image_url && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-white/10 mb-4 bg-zinc-900">
                      <Image
                        src={news.image_url}
                        alt={news.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <p className="text-sm text-zinc-400 line-clamp-3 mb-4">{news.content}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleEdit(news)}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(news.id)}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
