"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import NewsDetailModal from "./news-detail-modal";
import { News } from "@/features/news/types";

interface NewsGridProps {
  news: News[];
}

export default function NewsGrid({ news }: NewsGridProps) {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  if (news.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-zinc-500 italic">
        No hay noticias publicadas.
      </div>
    );
  }

  return (
    <>
      {news.map((item) => (
        <div
          key={item.id}
          onClick={() => setSelectedNews(item)}
          className="bg-[#101010] border border-white/8 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
        >
          <div>
            {item.image_url && (
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-900">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            )}
            <div className="p-6 space-y-3">
              <span className="text-xs text-zinc-500 font-medium">
                {new Date(item.created_at).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <h4 className="font-bebas text-2xl text-white tracking-[1px] line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                {item.content}
              </p>
            </div>
          </div>

          <div className="p-6 pt-0">
            <div className="flex items-center gap-1 text-xs text-primary font-bold tracking-wider uppercase group-hover:text-red-400 transition-colors">
              <span>LEER MÁS</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}

      {selectedNews && (
        <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
}
