"use client";

import * as React from "react";
import Image from "next/image";
import { Camera, Maximize2 } from "lucide-react";
import { DocumentationItem } from "@/types/database";
import { motion } from "motion/react";
import { EASE_NATURAL } from "@/lib/motion";
import { GalleryLightbox } from "./gallery-lightbox";

interface GallerySectionProps {
  galleryDocs: DocumentationItem[];
}

export function GallerySection({ galleryDocs }: GallerySectionProps) {
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: EASE_NATURAL,
      },
    },
  };

  return (
    <section id="dokumentasi" className="py-20 px-4 sm:px-6 bg-[#08090B] border-t border-[#2A2D34] relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: EASE_NATURAL }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#7B8DFF] mb-2">
              <Camera className="w-3.5 h-3.5 text-[#3D5CFF]" />
              <span>GALERI DOKUMENTASI</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-normal uppercase tracking-tight text-[#F5F5F2]">
              KENANGAN &amp; CERITA KELAS
            </h2>
          </div>
          <p className="font-handwriting text-2xl text-[#9A9DA5] max-w-sm">
            &ldquo;setiap foto menyimpan cerita yang tak terlupakan&rdquo;
          </p>
        </motion.div>

        {/* Photo Collage Grid */}
        {galleryDocs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {galleryDocs.map((doc, index) => {
              const cardRotations = [
                "rotate-[-1deg] hover:rotate-0",
                "rotate-[1.5deg] hover:rotate-0",
                "rotate-[-1.5deg] hover:rotate-0",
                "rotate-[1deg] hover:rotate-0",
              ];
              const tapeClasses = [
                "scrapbook-tape w-16 -top-2 left-4 rotate-[-3deg]",
                "scrapbook-tape w-16 -top-2 right-4 rotate-[2deg]",
                "scrapbook-tape w-16 -top-2 left-6 rotate-[-2deg]",
                "scrapbook-tape w-16 -top-2 right-6 rotate-[3deg]",
              ];
              const rotationClass = cardRotations[index % cardRotations.length];
              const tapeClass = tapeClasses[index % tapeClasses.length];
              const orderLabel = String(index + 1).padStart(2, "0");

              return (
                <motion.div
                  key={doc.id}
                  variants={cardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIdx(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedIdx(index);
                  }}
                  aria-label={`Buka foto: ${doc.title || doc.caption || "Dokumentasi Kelas"}`}
                  className={`relative rounded-xl bg-[#111318] border border-[#2A2D34] p-3 shadow-xl shadow-black/50 ${rotationClass} transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:border-[#3D5CFF]/60`}
                >
                  <div className={tapeClass} />
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#08090B]">
                    <Image
                      src={doc.image_url}
                      alt={doc.title || doc.caption || "Dokumentasi Kelas"}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={doc.image_url.startsWith("blob:") || doc.image_url.startsWith("data:")}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* View overlay icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/20">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {doc.overlay_text && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest text-[#F5F5F2] uppercase">
                        {doc.overlay_text}
                      </div>
                    )}
                  </div>
                  <div className="pt-3 pb-1 px-1 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#3D5CFF] block">
                      {doc.category_label || `DOCUMENTATION / ${orderLabel}`}
                    </span>
                    <p className="font-handwriting text-lg text-[#F5F5F2] leading-tight">
                      &ldquo;{doc.caption}&rdquo;
                    </p>
                    <span className="text-[10px] font-mono text-[#9A9DA5] block">
                      {doc.meta_text || "XI RPL 2 / 2026"}
                    </span>
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#9A9DA5]/70 border-t border-white/5 mt-1">
                      <span>{doc.footer_text || "ARSIP DOKUMENTER KELAS"}</span>
                      <span>{doc.tagline_text || "SATU KELAS. BANYAK CERITA."}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[#2A2D34] rounded-2xl bg-[#111318]/50 space-y-3">
            <Camera className="w-8 h-8 text-[#9A9DA5]/40 mx-auto" />
            <p className="font-mono text-xs uppercase tracking-wider text-[#9A9DA5]">
              Belum ada dokumentasi galeri
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <GalleryLightbox
          items={galleryDocs}
          currentIndex={selectedIdx}
          isOpen={selectedIdx !== null}
          onClose={() => setSelectedIdx(null)}
          onNavigate={(newIdx) => setSelectedIdx(newIdx)}
        />
      )}
    </section>
  );
}
