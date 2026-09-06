'use client';
/* ---------------------------------------------------------------------------
   Left-edge scroll rail. A hairline track with a droplet running down it, the
   filled length carrying a teal-to-cyan-to-ember gradient. Decorative only —
   the native scrollbar keeps doing the work for anyone who needs it.
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
