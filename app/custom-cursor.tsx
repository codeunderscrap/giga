'use client';
/* ---------------------------------------------------------------------------
   Custom cursor — ported from the Minimines contact page: an instant-follow
   dot plus a ring that's magnetically pulled toward it (spring physics, not
   a plain lag), growing on hover over interactive elements and yielding to
   the native text cursor over writable fields.
--------------------------------------------------------------------------- */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
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

    const stiffness = 0.14;
    const damping = 0.86;

    document.body.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
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

    const onMouseEnterLink = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.4, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };
    const onMouseLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    const onMouseLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onMouseEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    const isTextField = (el: EventTarget | null): el is HTMLElement =>
      el instanceof HTMLElement && el.matches("input, textarea, select, [contenteditable='true']");

    const onDocMouseOver = (e: MouseEvent) => {
      if (isTextField(e.target)) {
        gsap.to([dot, ring], { opacity: 0, duration: 0.15 });
        document.body.style.cursor = 'auto';
      }
    };
    const onDocMouseOut = (e: MouseEvent) => {
      if (isTextField(e.target)) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.15 });
        document.body.style.cursor = 'none';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onDocMouseOver);
    document.addEventListener('mouseout', onDocMouseOut);

    const interactives = document.querySelectorAll('a, button, [role="button"]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onDocMouseOver);
      document.removeEventListener('mouseout', onDocMouseOut);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cc-dot" />
      <div ref={ringRef} className="cc-ring" />
    </>
  );
}
