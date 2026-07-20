"use client";

import { useState } from "react";
import { GalleryImage } from "@/features/gallery/types";
import { Album } from "@/features/gallery/album-types";
import ImageLightbox from "@/components/image-lightbox";
import Image from "next/image";

interface GallerySectionProps {
  images: GalleryImage[];
  albums: Album[];
}

export default function GallerySection({ images, albums }: GallerySectionProps) {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [lightboxSrc, setLightboxUrl] = useState<string | null>(null);

  const filteredImages = selectedAlbumId
    ? images.filter((img) => img.album_id === selectedAlbumId)
    : images;

  return (
    <div className="space-y-8">
      {/* Filtros de Álbumes */}
      {albums.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedAlbumId("")}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${selectedAlbumId === ""
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
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${selectedAlbumId === album.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
            >
              {album.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Fotos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredImages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-500 italic">
            No hay fotos en este álbum.
          </div>
        ) : (
          filteredImages.map((img) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer group"
              onClick={() => setLightboxUrl(img.image_url)}
            >
              <Image
                src={img.image_url}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <h4 className="font-bebas text-md text-white tracking-[1px]">{img.title}</h4>
                {img.description && (
                  <p className="text-[10px] text-zinc-300 line-clamp-2 mt-1">{img.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxUrl(null)} />
      )}
    </div>
  );
}
