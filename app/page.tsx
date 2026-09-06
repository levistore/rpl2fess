import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { SecuritySection } from "@/components/landing/security-section";
import { CtaSection } from "@/components/landing/cta-section";
import {
  getFeaturedDocumentation,
  getGalleryDocumentation,
} from "@/lib/queries/documentation";

export default async function HomePage() {
  const [featuredDoc, galleryDocs] = await Promise.all([
    getFeaturedDocumentation(),
    getGalleryDocumentation(),
  ]);

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F5F2] flex flex-col selection:bg-[#3D5CFF] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* 1. Hero Section with Staggered Entrance */}
      <HeroSection featuredDoc={featuredDoc} />

      {/* Subtle Marquee Divider */}
      <div className="border-y border-[#2A2D34] bg-[#111318]/70 py-3.5 overflow-hidden select-none">
        <div className="flex items-center gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-[#9A9DA5]">
          <span>SATU KELAS. BANYAK CERITA /</span>
          <span>PESAN ANONIM /</span>
          <span>TANPA NAMA /</span>
          <span>RPL 2 /</span>
          <span>RAHASIA TERJAMIN /</span>
          <span>DOKUMENTASI KELAS /</span>
          <span>SATU KELAS. BANYAK CERITA /</span>
          <span>ANTI-SPAM AKTIF /</span>
        </div>
      </div>

      {/* 2. Cara Kerja Section with Step Reveal */}
      <WorkflowSection />

      {/* 3. Class Photography Collage with Hover & Lightbox */}
      <GallerySection galleryDocs={galleryDocs} />

      {/* 4. Keamanan & Privasi Section with Staggered Cards */}
      <SecuritySection />

      {/* 5. Bottom Call to Action with Reveal & Tap Feedback */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
