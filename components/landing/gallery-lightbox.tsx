"use client";

import * as React from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { DocumentationItem } from "@/types/database";
import { motion, AnimatePresence } from "motion/react";
import { EASE_NATURAL } from "@/lib/motion";

interface GalleryLightboxProps {
  items: DocumentationItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function GalleryLightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const currentItem = items[currentIndex];

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate((currentIndex - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") onNavigate((currentIndex + 1) % items.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  // Lock scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!currentItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Close Button Fade */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            type="button"
            onClick={onClose}
            aria-label="Tutup preview"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2.5 rounded-full bg-[#181B21]/80 border border-[#2A2D34] text-[#F5F5F2] hover:bg-[#252830] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Navigation Buttons */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex - 1 + items.length) % items.length);
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-[#181B21]/80 border border-[#2A2D34] text-[#F5F5F2] hover:bg-[#252830] transition-transform active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex + 1) % items.length);
                }}
                aria-label="Foto berikutnya"
                className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-[#181B21]/80 border border-[#2A2D34] text-[#F5F5F2] hover:bg-[#252830] transition-transform active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Lightbox Content Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: EASE_NATURAL }}
            className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col items-center justify-center p-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: EASE_NATURAL }}
                className="w-full flex flex-col items-center"
              >
                <div className="relative w-full max-h-[60vh] sm:max-h-[68vh] aspect-[4/3] rounded-2xl overflow-hidden bg-[#08090B] border border-[#2A2D34] shadow-2xl">
                  <Image
                    src={currentItem.image_url}
                    alt={currentItem.title || currentItem.caption || "Dokumentasi Kelas"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 95vw, 800px"
                    priority
                  />
                </div>

                {/* Caption / Details */}
                <div className="mt-4 text-center max-w-xl px-4 space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#3D5CFF]">
                    {currentItem.category_label || `DOKUMENTASI ${currentIndex + 1} DARI ${items.length}`}
                  </span>
                  {currentItem.caption && (
                    <p className="font-handwriting text-xl sm:text-2xl text-[#F5F5F2]">
                      &ldquo;{currentItem.caption}&rdquo;
                    </p>
                  )}
                  <span className="text-xs font-mono text-[#9A9DA5] block">
                    {currentItem.meta_text || "XI RPL 2 • 2026"}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
