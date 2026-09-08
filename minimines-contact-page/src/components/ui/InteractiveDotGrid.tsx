"use client";

import { useEffect, useRef } from "react";

export function InteractiveDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates — the spotlight is magnetically pulled toward the
    // cursor via spring physics (accelerates toward it, settles with a bit
    // of give) rather than a simple lerp, so it trails with real delay.
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      velX: 0,
      velY: 0,
      radius: 180, // Spotlight radius
    };
    const spotlightStiffness = 0.1;
    const spotlightDamping = 0.82;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Grid configuration: tighter spacing = higher density of dots
    const spacing = 12;
    const dotRadius = 0.7;
    let cols = 0;
    let rows = 0;

    // Each dot has its own wave phase (the "wavy" ripple across the grid), so
    // its alpha keeps changing every frame — it can't be cached into one
    // static path. Instead, dots are bucketed by alpha into a handful of
    // Path2Ds each frame, so we still only pay for a few fill() calls (the
    // expensive part) rather than one per dot, while every dot keeps rippling
    // on its own phase.
    const ALPHA_MIN = 0.12;
    const ALPHA_MAX = 0.2;
    const BUCKET_COUNT = 8;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    handleResize();

    let time = 0;

    const render = () => {
      time += 0.012;

      // Magnetic pull toward the cursor with a bit of delay, instead of a
      // plain lerp — accelerates toward the target, then settles.
      const dxTarget = mouse.targetX - mouse.x;
      const dyTarget = mouse.targetY - mouse.y;
      mouse.velX = (mouse.velX + dxTarget * spotlightStiffness) * spotlightDamping;
      mouse.velY = (mouse.velY + dyTarget * spotlightStiffness) * spotlightDamping;
      mouse.x += mouse.velX;
      mouse.y += mouse.velY;

      ctx.clearRect(0, 0, width, height);

      // Bucket every dot's wavy alpha into a handful of paths, then fill each once.
      const buckets: Path2D[] = Array.from({ length: BUCKET_COUNT }, () => new Path2D());

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const wave = Math.sin(time + i * 0.08 + j * 0.08) * 0.04;
          const alpha = 0.16 + wave;
          const t = (alpha - ALPHA_MIN) / (ALPHA_MAX - ALPHA_MIN);
          const bucketIndex = Math.min(BUCKET_COUNT - 1, Math.max(0, Math.round(t * (BUCKET_COUNT - 1))));
          const path = buckets[bucketIndex];
          path.moveTo(x + dotRadius, y);
          path.arc(x, y, dotRadius, 0, Math.PI * 2);
        }
      }

      for (let b = 0; b < BUCKET_COUNT; b++) {
        const bucketAlpha = ALPHA_MIN + (b / (BUCKET_COUNT - 1)) * (ALPHA_MAX - ALPHA_MIN);
        ctx.fillStyle = `rgba(255, 255, 255, ${bucketAlpha})`;
        ctx.fill(buckets[b]);
      }

      // Cursor glow: only touch the small neighbourhood of dots that can
      // actually fall inside the spotlight radius — a plain circle again.
      const r = mouse.radius;
      if (mouse.x > -r && mouse.x < width + r && mouse.y > -r && mouse.y < height + r) {
        const minI = Math.max(0, Math.floor((mouse.x - r) / spacing));
        const maxI = Math.min(cols - 1, Math.ceil((mouse.x + r) / spacing));
        const minJ = Math.max(0, Math.floor((mouse.y - r) / spacing));
        const maxJ = Math.min(rows - 1, Math.ceil((mouse.y + r) / spacing));
        const rSq = r * r;

        for (let i = minI; i <= maxI; i++) {
          for (let j = minJ; j <= maxJ; j++) {
            const x = i * spacing;
            const y = j * spacing;
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const distSq = dx * dx + dy * dy;
            if (distSq >= rSq) continue;

            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / r;
            const glowIntensity = factor * factor;
            const radius = 0.7 + glowIntensity * 1.3;

            // Orange is the dominant color; teal only rims the outer edge.
            const color =
              factor > 0.3
                ? `rgba(232, 87, 26, ${0.35 + glowIntensity * 0.65})`
                : `rgba(45, 150, 178, ${0.28 + glowIntensity * 0.72})`;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.95 }}
    />
  );
}
