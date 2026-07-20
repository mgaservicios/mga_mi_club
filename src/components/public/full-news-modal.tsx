"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { News } from "@/features/news/types";
import NewsDetailModal from "./news-detail-modal";

interface FullNewsModalProps {
  news: News[];
  onClose: () => void;
}

export default function FullNewsModal({ news, onClose }: FullNewsModalProps) {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedNews) {
          setSelectedNews(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, selectedNews]);

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 pt-24 sm:p-8 sm:pt-24"
        onClick={onClose}
      >
        <div
          className="relative bg-[#101010] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="sticky top-3 float-right mr-3 mt-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            <h3 className="font-bebas text-3xl text-white tracking-[1px] mb-4">
              ÚLTIMAS <span className="text-primary">NOTICIAS</span>
            </h3>
            <div className="w-12 h-1 bg-primary mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="bg-[#0a0a0a] border border-white/8 rounded-xl overflow-hidden flex flex-col justify-between hover:border-primary/30 transition-all duration-300 group cursor-pointer"
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
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {new Date(item.created_at).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <h4 className="font-bebas text-xl text-white tracking-[1px] line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedNews && (
        <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </>
  );
}
