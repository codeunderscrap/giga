"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let velX = 0;
    let velY = 0;

    // Spring constants: the ring is magnetically pulled toward the dot
    // (accelerates toward it, then settles) rather than just trailing along its path.
    // Higher damping relative to stiffness keeps the pull smooth instead of bouncy.
    const stiffness = 0.14;
    const damping = 0.86;

    // Hide default cursor
    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    let raf = 0;
    const tick = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      velX = (velX + dx * stiffness) * damping;
      velY = (velY + dy * stiffness) * damping;
      ringX += velX;
      ringY += velY;
      gsap.set(ring, { x: ringX, y: ringY });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Expand ring on hover over interactive elements
    const onMouseEnterLink = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.4, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };

    const onMouseLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    // Hide cursor when leaving window
    const onMouseLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onMouseEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    // Over any writable field, hide the custom cursor entirely and restore
    // the native cursor (the text I-beam) so people can actually see where
    // they're about to type. Delegated on document so it also covers fields
    // that mount later (e.g. the form's conditional inputs).
    const isTextField = (el: EventTarget | null): el is HTMLElement =>
      el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable='true']");

    const onDocMouseOver = (e: MouseEvent) => {
      if (isTextField(e.target)) {
        gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
        document.body.style.cursor = "auto";
      }
    };
    const onDocMouseOut = (e: MouseEvent) => {
      if (isTextField(e.target)) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.15 });
        document.body.style.cursor = "none";
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onDocMouseOver);
    document.addEventListener("mouseout", onDocMouseOut);

    const interactives = document.querySelectorAll("a, button, [data-cursor-hover]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterLink);
      el.addEventListener("mouseleave", onMouseLeaveLink);
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onDocMouseOver);
      document.removeEventListener("mouseout", onDocMouseOut);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterLink);
        el.removeEventListener("mouseleave", onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
      {/* Inner dot — follows cursor instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      {/* Outer ring — a plain circle that follows with a smooth magnetic lag */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
    </>
  );
}
