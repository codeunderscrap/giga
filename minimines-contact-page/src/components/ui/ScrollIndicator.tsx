"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollIndicator (Aligned with Navbar Height)
 * ─────────────────────────────────────────────────────────────
 * • Track: Starts at top-6 (aligning with the floating navbar), ends at bottom-8
 * • Dashed line: Faint white (~16% opacity) along the entire track
 * • Fill line: Solid orange (#E8571A) to teal (#2D96B2) gradient ONLY above the white dot
 * • Below the white dot: STRICTLY the faint dashed line with NO color
 * • Glowing white dot: Smoothly tracks scroll progress
 */
export function ScrollIndicator() {
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress =
        docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

      if (fillRef.current) {
        fillRef.current.style.height = `${progress * 100}%`;
      }
      if (dotRef.current) {
        dotRef.current.style.top = `${progress * 100}%`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed right-6 top-6 bottom-8 z-40 flex items-start justify-center pointer-events-none"
      style={{ width: "2px" }}
      aria-hidden="true"
    >
      {/* ── Unfilled Track: Faint Dashed Line from Navbar Height ── */}
      <div
        className="absolute inset-0 w-[2px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 4px, transparent 4px, transparent 8px)",
        }}
      />

      {/* ── Filled Track: Solid Orange→Teal Gradient terminating strictly at dot ── */}
      <div
        ref={fillRef}
        className="absolute top-0 left-0 w-[2px]"
        style={{
          height: "0%",
          background: "linear-gradient(to bottom, #E8571A 0%, #2D96B2 100%)",
          boxShadow: "0 0 8px rgba(232,87,26,0.6)",
          transition: "height 0.08s ease-out",
        }}
      />

      {/* ── Glowing White Indicator Dot ── */}
      <div
        ref={dotRef}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          top: "0%",
          width: "9px",
          height: "9px",
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 0 8px 2px rgba(255,255,255,0.9), 0 0 16px 4px rgba(45,150,178,0.6)",
          transition: "top 0.08s ease-out",
        }}
      />
    </div>
  );
}
