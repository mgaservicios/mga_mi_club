"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import ImageLightbox from "@/components/image-lightbox";
import { GalleryImage } from "@/features/gallery/types";
import { Album } from "@/features/gallery/album-types";

interface FullGalleryModalProps {
  images: GalleryImage[];
  albums: Album[];
  onClose: () => void;
}

export default function FullGalleryModal({ images, albums, onClose }: FullGalleryModalProps) {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [lightboxSrc, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxSrc) {
          setLightboxUrl(null);
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
  }, [onClose, lightboxSrc]);

  const filteredImages = selectedAlbumId
    ? images.filter((img) => img.album_id === selectedAlbumId)
    : images;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 pt-24 sm:p-8 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="relative bg-[#101010] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
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
            GALERÍA DE <span className="text-primary">FOTOS</span>
          </h3>
          <div className="w-12 h-1 bg-primary mb-6" />

          {albums.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedAlbumId("")}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                  selectedAlbumId === ""
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                TODAS
              </button>
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                    selectedAlbumId === album.id
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {album.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredImages.length === 0 ? (
              <div className="col-span-full text-center py-12 text-zinc-500 italic">
                No hay fotos en este álbum.
              </div>
            ) : (
              filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer group"
                  onClick={() => setLightboxUrl(img.image_url)}
                >
                  <Image
                    src={img.image_url}
                    alt={img.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxUrl(null)} />
      )}
    </div>
  );
}
