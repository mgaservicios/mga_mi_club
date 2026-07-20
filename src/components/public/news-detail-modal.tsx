"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface NewsDetailModalProps {
  news: {
    title: string;
    content: string;
    image_url: string | null;
    created_at: string;
  };
  onClose: () => void;
}

export default function NewsDetailModal({ news, onClose }: NewsDetailModalProps) {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxImg) {
          setLightboxImg(null);
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
  }, [onClose, lightboxImg]);

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      new Date(news.created_at).toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [news.created_at]);

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 pt-24 sm:p-8 sm:pt-24"
        onClick={onClose}
      >
        <div
          className="relative bg-[#101010] border border-white/10 rounded-2xl max-w-2xl w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {news.image_url && (
            <div
              className="w-full bg-black rounded-t-2xl cursor-pointer"
              onClick={() => setLightboxImg(news.image_url!)}
            >
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full object-contain"
                style={{ maxHeight: "30vh" }}
              />
            </div>
          )}

          <div className="p-5">
            <p className="text-[11px] text-zinc-500 font-medium mb-2">{formattedDate}</p>
            <h3 className="font-bebas text-3xl text-white tracking-[1px] mb-3">{news.title}</h3>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {news.content}
            </p>
          </div>
        </div>
      </div>

      {lightboxImg && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/98 p-4 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImg}
            alt="Foto completa"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}
