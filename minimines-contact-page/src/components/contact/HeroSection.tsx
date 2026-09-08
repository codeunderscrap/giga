"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";

// Dynamically imported (client-only, code-split) so the R3F/three.js runtime
// never ships in the main bundle — it only loads if/when this scene mounts.
const BatteryShowcase = dynamic(
  () => import("./BatteryShowcase").then((m) => m.BatteryShowcase),
  { ssr: false }
);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, delay: 0.25 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85 },
          "-=0.7"
        )
        .fromTo(
          taglineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.6"
        )
        .fromTo(
          panelsRef.current?.children ? Array.from(panelsRef.current.children) : [],
          { x: 35, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.85, stagger: 0.18 },
          "-=0.7"
        )
        .fromTo(
          scrollPromptRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-32 pb-8 z-10 select-none overflow-hidden"
    >
      {/* ── Main Content Row: flex (not a 12-col grid) so a big gap doesn't eat width at every phantom gutter ── */}
      <div className="flex-1 flex flex-col lg:flex-row lg:justify-center items-center gap-y-14 gap-x-20 xl:gap-x-24 my-auto max-w-[1200px] mx-auto w-full">
        {/* ── Left Column: Headline, Subtitle & Clean Tagline ── */}
        <div className="flex flex-col gap-8 max-w-2xl">
          {/* Main Display Headline (Reference Image 5 Style: Tall Condensed Uppercase) */}
          <h1
            ref={headlineRef}
            className="text-6xl sm:text-7xl xl:text-8xl font-black uppercase tracking-tight leading-[0.92]"
            style={{
              fontFamily:
                '"Oswald", "Inter", "Impact", -apple-system, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            <span className="block text-white">COME CONNECT</span>
            <span
              className="block mt-1 text-[#E8571A]"
              style={{
                textShadow: "0 0 40px rgba(232, 87, 26, 0.25)",
              }}
            >
              WITH US.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl sm:text-2xl xl:text-[1.75rem] text-[#E2E8F0] font-medium leading-snug max-w-xl"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Reducing waste by recovering and refining critical minerals and rare
            earth elements for a better world.
          </p>

          {/* Clean Typography Line for Recycle / Recovery / Refine (No Pills) */}
          <div
            ref={taglineRef}
            className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#2D96B2] pt-1"
            style={{ letterSpacing: "0.12em" }}
          >
            <span className="hover:text-white transition-colors duration-200">Recycle</span>
            <span className="text-white/25">|</span>
            <span className="hover:text-white transition-colors duration-200">Recover</span>
            <span className="text-white/25">|</span>
            <span className="hover:text-white transition-colors duration-200">Refine</span>
          </div>
        </div>

        {/* ── Right Column: interactive lithium-ion cell showcase ── */}
        <div ref={panelsRef} className="w-full lg:w-[440px] flex-shrink-0">
          <BatteryShowcase />
        </div>
      </div>

      {/* ── Centered Scroll Down Animation (Reference Image 4 Style) ── */}
      <div
        ref={scrollPromptRef}
        className="w-full flex justify-center items-center py-4"
      >
        <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[#94A3B8] hover:text-white transition-colors duration-200 cursor-pointer">
          <span className="font-semibold">SCROLL DOWN</span>
          {/* Minimalist mouse pill icon with animated interior dot */}
          <div className="relative w-4 h-6 rounded-full border border-[#64748B] flex justify-center p-0.5">
            <span className="w-1 h-1.5 rounded-full bg-[#E8571A] animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
