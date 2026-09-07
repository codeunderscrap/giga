'use client';
/* ---------------------------------------------------------------------------
   Right-edge scroll rail. A dashed hairline track with a solid gradient fill
   terminating at a glowing dot that tracks scroll progress — same structure
   as the Minimines contact page's indicator, still GigaMines' own teal-to-
   cyan-to-ember palette. Decorative only — the native scrollbar keeps doing
   the work for anyone who needs it.
--------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';

export default function ScrollRail() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const travel = document.documentElement.scrollHeight - innerHeight;
      setProgress(travel > 4 ? Math.min(1, Math.max(0, scrollY / travel)) : 0);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', request);
      removeEventListener('resize', request);
    };
  }, []);

  return (
    <div className="scroll-rail" aria-hidden="true" style={{ '--p': progress } as React.CSSProperties}>
      <span className="rail-track" />
      <span className="rail-fill" />
      <span className="rail-drop" />
    </div>
  );
}
