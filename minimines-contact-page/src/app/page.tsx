"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/ui/Navbar";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/contact/HeroSection";
import { ContactFormSection } from "@/components/contact/ContactFormSection";

// Dynamically import client-only Canvas & Three.js components to prevent SSR WebGL mismatch
const InteractiveDotGrid = dynamic(
  () =>
    import("@/components/ui/InteractiveDotGrid").then(
      (m) => m.InteractiveDotGrid
    ),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative min-h-[140vh] w-full bg-[#060D1A] text-white selection:bg-[#E8571A] selection:text-white overflow-x-hidden">
      {/* ── 1. Background Interactive Dotted Matrix with Cursor Glow ── */}
      <InteractiveDotGrid />

      {/* ── 2. Subtle Aurora Ambient Glow Blobs in Background ── */}
      <div
        className="pointer-events-none fixed -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[130px] z-0"
        style={{
          background: "radial-gradient(circle, #E8571A 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -bottom-40 -left-40 w-[650px] h-[650px] rounded-full opacity-25 blur-[140px] z-0"
        style={{
          background: "radial-gradient(circle, #2D96B2 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── 4. Compact Floating Pill Navbar ── */}
      <Navbar />

      {/* ── 5. Main Hero Section Content & Mission Cards ── */}
      <HeroSection />

      {/* ── 6. Fixed Version 10 Scroll Indicator on Right Edge ── */}
      <ScrollIndicator />

      {/* ── 7. Contact Form Section ── */}
      <ContactFormSection />

      {/* ── 8. Footer ── */}
      <Footer />
    </main>
  );
}
