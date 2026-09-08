"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Technology", href: "#technology" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Smooth entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", delay: 0.1 }
    );

    // Nav stays fixed and visible at all times — only its glass depth changes with scroll
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Below the md breakpoint the link row is hidden — close the mobile menu
  // if the viewport is resized back up past it, so it can't get stuck open.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
      style={{ opacity: 0 }}
    >
      {/* ── Glass Floating Pill Container: this bar IS pill #1 ── */}
      <div
        className="pointer-events-auto flex items-center justify-between w-full max-w-4xl px-5 sm:px-7 py-2.5 rounded-full transition-all duration-300"
        style={{
          // Deep glass effect: heavier blur + saturation for a more pronounced frosted look,
          // with just enough fill to keep the nav text legible over any background.
          background: scrolled
            ? "rgba(6, 16, 27, 0.52)"
            : "rgba(8, 22, 36, 0.38)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow:
            "0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.18)",
        }}
      >
        {/* ── Brand Logo (transparent PNG, no background box) ── */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
          data-cursor-hover
        >
          <div className="relative h-9 w-36 sm:h-10 sm:w-40 overflow-hidden">
            <Image
              src="/logo-white.png"
              alt="Minimines Cleantech Solutions"
              fill
              sizes="(max-width: 640px) 144px, 160px"
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* ── Navigation Links: plain text, no per-link pills ── */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              data-cursor-hover
              className="text-sm font-medium text-[#CBD5E1] hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* ── CTA Button: pill #2 ── */}
          <Link
            href="#contact"
            data-cursor-hover
            className="relative inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-full bg-[#E8571A] hover:bg-[#FF6A28] transition-all duration-200 shadow-[0_0_20px_rgba(232,87,26,0.45)] hover:shadow-[0_0_28px_rgba(232,87,26,0.7)] hover:scale-[1.04]"
          >
            Get in Touch
          </Link>

          {/* ── Mobile menu toggle — only shown where the link row above is hidden ── */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            data-cursor-hover
            className="md:hidden relative w-9 h-9 flex-shrink-0 flex items-center justify-center text-white"
          >
            <span className="relative w-5 h-4 block">
              <span
                className="absolute left-0 top-0 w-full h-[1.5px] bg-current transition-transform duration-300"
                style={{ transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-current transition-opacity duration-200"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="absolute left-0 bottom-0 w-full h-[1.5px] bg-current transition-transform duration-300"
                style={{ transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown panel ── */}
      <div
        className={`md:hidden pointer-events-auto absolute top-full left-4 right-4 mt-2 overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="flex flex-col gap-1 p-3 rounded-2xl"
          style={{
            background: "rgba(6, 16, 27, 0.85)",
            backdropFilter: "blur(40px) saturate(200%)",
            WebkitBackdropFilter: "blur(40px) saturate(200%)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.45)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              data-cursor-hover
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#CBD5E1] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
