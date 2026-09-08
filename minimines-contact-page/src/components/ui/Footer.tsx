"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import DottedMap, { type MapData } from "dotted-map/without-countries";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import worldMapGrid from "@/data/worldMapGrid.json";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.6" />
        <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9.5" />
        <path d="M13.6 21.5v-7.2h2.4l.4-2.8h-2.8V9.6c0-.8.2-1.4 1.4-1.4h1.5V5.7c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H8.5v2.8h2.4v7.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" />
        <rect x="6.3" y="9.8" width="2.4" height="8" fill="currentColor" stroke="none" />
        <circle cx="7.5" cy="6.6" r="1.5" fill="currentColor" stroke="none" />
        <path d="M11.3 17.8V9.8h2.3v1.2c.5-.8 1.4-1.4 2.7-1.4 2 0 3.2 1.3 3.2 3.8v4.4h-2.4v-4c0-1.1-.4-1.9-1.5-1.9-.8 0-1.4.5-1.6 1.1-.1.2-.1.5-.1.8v4z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

// A handful of real-world city coordinates standing in for office/region markers
const officeLocations = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 51.5072, lng: -0.1276 }, // London
  { lat: 52.52, lng: 13.405 }, // Berlin
  { lat: 19.076, lng: 72.8777 }, // Mumbai
  { lat: 1.3521, lng: 103.8198 }, // Singapore
  { lat: -33.8688, lng: 151.2093 }, // Sydney
];

// Built once at module load — the grid itself is precomputed (see src/data/worldMapGrid.json),
// so this is cheap even though it looks expensive.
const worldMap = new DottedMap({ map: worldMapGrid as unknown as MapData });
officeLocations.forEach((loc) =>
  worldMap.addPin({ ...loc, svgOptions: { color: "#E8571A", radius: 1.1 } })
);
const mapPoints = worldMap.getPoints();
const MAP_WIDTH = worldMapGrid.width;
const MAP_HEIGHT = worldMapGrid.height;

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax: the map drifts slightly slower than the page scroll
      gsap.to(mapRef.current, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-10 w-full overflow-hidden border-t border-[rgba(255,255,255,0.08)]"
      style={{ background: "#03060B" }}
    >
      {/* ── Full, unclipped world dot-map — the background the content sits on top of ── */}
      <svg
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {mapPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.svgOptions?.radius ?? 0.45}
            fill={p.svgOptions?.color ?? "#3D5A73"}
            style={p.svgOptions?.color ? { filter: "drop-shadow(0 0 1.5px rgba(232,87,26,0.9))" } : undefined}
          />
        ))}
      </svg>

      {/* Scrim so text stays legible over the map */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,6,11,0.88) 0%, rgba(3,6,11,0.62) 35%, rgba(3,6,11,0.62) 65%, rgba(3,6,11,0.92) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Footer content — overlaid on top of the map, not stacked below it ── */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-20 pt-10 pb-6 flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <div className="relative h-12 w-48">
              <Image src="/logo-white.png" alt="Minimines Cleantech Solutions" fill className="object-contain object-left" />
            </div>
            <span className="text-xs text-[#B7C4D1] flex flex-col">
              <span>No. 41, KIADB Industrial Area, Veerapura,</span>
              <span>Doddaballapur, Bengaluru, Karnataka 561203</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#E2E8F0]">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} data-cursor-hover className="hover:text-white transition-colors duration-200">
                {link.label}
              </a>
            ))}
            <span className="text-[#8FA6BA] opacity-60 italic hidden sm:inline">+ 2 more reserved</span>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#B7C4D1] font-semibold">
              Social Media
            </span>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  data-cursor-hover
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.16)] bg-[rgba(3,6,11,0.4)] text-[#E2E8F0] hover:border-[#2D96B2] hover:text-white hover:bg-[rgba(45,150,178,0.18)] transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-[#8FA6BA] border-t border-[rgba(255,255,255,0.08)] pt-4">
          © 2026 Minimines Cleantech Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
