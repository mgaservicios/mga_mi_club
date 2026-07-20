"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface HistoryModalProps {
  history: string;
  onClose: () => void;
}

export default function HistoryModal({ history, onClose }: HistoryModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 pt-24 sm:p-8 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="relative bg-[#101010] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="sticky top-3 float-right mr-3 w-10 h-10 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-primary hover:border-primary transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h3 className="font-bebas text-3xl text-white tracking-[1px] mb-4">
            NUESTRA <span className="text-primary">HISTORIA</span>
          </h3>
          <div className="w-12 h-1 bg-primary mb-6" />
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {history}
          </p>
        </div>
      </div>
    </div>
  );
}
