"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: "logos" | "players" | "championships" | "matches" | "gallery" | "news" | "rivals";
  className?: string;
  circular?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  folder,
  className = "",
  circular = false,
}: ImageUploadProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("team-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("team-assets").getPublicUrl(filePath);
      onChange(data.publicUrl);
    } catch (err: any) {
      setError(err.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group">
            <div
              className={`relative overflow-hidden border border-white/10 bg-zinc-900 ${circular ? "w-24 h-24 rounded-full" : "w-40 h-28 rounded-lg"
                }`}
            >
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex flex-col items-center justify-center border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${circular ? "w-24 h-24 rounded-full" : "w-40 h-28 rounded-lg"
              }`}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-zinc-400 mb-1" />
                <span className="text-[10px] text-zinc-400">Subir foto</span>
              </>
            )}
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
