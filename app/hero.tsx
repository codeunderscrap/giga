'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { capabilities, sections } from './capabilities';
import Complex from './complex';

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};

/* Feedstock in, refined material out — straight from the G-HUB two-pager.
   This strip is where confirmed association and grant marks will sit once
   section 4.4 of the requirements sheet is signed off. */
const stream = [
  'BLACK MASS',
  'SPENT LI-ION BATTERIES',
  'ORE CONCENTRATES',
  'MHP',
  'NdFeB MAGNETS',
  'SPENT CATALYTIC CONVERTORS',
  'MINE TAILINGS',
  'SUPER ALLOYS',
  'LITHIUM CARBONATE',
  'COBALT SULPHATE',
  'NICKEL SULPHATE',
  'GRAPHITE',
];

type Particle = { a: number; r: number; s: number; z: number };

export default function Hero() {
  const outer = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [introHidden, setIntroHidden] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = stage.current!;
    const wrap = outer.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext('2d');
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const styles = getComputedStyle(el);
    const glow = styles.getPropertyValue('--glow').trim() || '#66d9e8';
    const brand = styles.getPropertyValue('--brand').trim() || '#4c9eaf';

    let w = 0;
    let h = 0;
    let maxR = 1;
    let frame = 0;
    let px = -9999;
    let py = -9999;
    let progress = 0;
    let particles: Particle[] = [];

    /* Seed on a disc with sqrt-distributed radii, so density is even across
       the field rather than piling up in the middle. */
    const seed = (p: Particle, outside = false) => {
      p.a = Math.random() * Math.PI * 2;
      p.r = maxR * (outside ? 1 + Math.random() * 0.25 : Math.sqrt(Math.random()));
      p.s = 0.6 + Math.random() * 0.8;
      p.z = 0.35 + Math.random() * 0.65;
    };

    function resize() {
      w = el.clientWidth;
      h = el.clientHeight;
      maxR = Math.max(w, h) * 0.78;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      cv.width = w * ratio;
      cv.height = h * ratio;
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(950, Math.round((w * h) / 1750));
      particles = Array.from({ length: count }, () => {
        const p: Particle = { a: 0, r: 0, s: 1, z: 1 };
        seed(p);
        return p;
      });
    }

    function readScroll() {
      if (media.matches) return 0;
      const travel = Math.max(1, wrap.offsetHeight - h);
      return clamp(-wrap.getBoundingClientRect().top / travel);
    }

    function tick() {
      progress = readScroll();
      /* Every transition lands by ~0.60. The remaining scroll is a deliberate
         hold: the complex stays pinned and fully interactive so the model and
         its hotspots are not scrolled past before anyone has touched them. */
      const split = ease((progress - 0.07) / 0.4);
      const reveal = ease((progress - 0.26) / 0.32);
      el.style.setProperty('--split', String(split));
      el.style.setProperty('--reveal', String(reveal));
      el.style.setProperty('--intro', String(1 - ease(progress / 0.1)));
      el.style.setProperty('--progress', String(progress));
      el.style.setProperty('--text-alpha', String(1 - ease((progress - 0.4) / 0.13)));
      setIntroHidden(progress > 0.1);
      setRevealed(progress > 0.54);
      setReleasing(progress > 0.88);

      if (ctx) {
        const cx = w / 2;
        const cy = h * 0.48;
        const squash = h / Math.max(1, w);
        /* Constant inward drift at rest; scroll accelerates the collapse. */
        const pull = 0.4 + Math.min(progress, 0.6) * 17;
        const swirl = 0.0022 + Math.min(progress, 0.6) * 0.0065;
        const globalFade = 1 - ease((progress - 0.3) / 0.22);
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
          p.r -= pull * p.s;
          p.a += swirl * p.s;
          if (p.r < 6) seed(p, true);
          const x = cx + Math.cos(p.a) * p.r;
          const y = cy + Math.sin(p.a) * p.r * squash;
          /* Fade in as it enters the field, fade out as it nears the core. */
          const near = clamp((p.r - maxR * 0.06) / (maxR * 0.2));
          const far = clamp((maxR * 1.28 - p.r) / (maxR * 0.24));
          const heat = Math.max(0, 1 - Math.hypot(x - px, y - py) / 210);
          const alpha = near * far * p.z * globalFade * (0.6 + heat * 0.4);
          if (alpha <= 0.01) continue;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = heat > 0.06 ? glow : p.z > 0.82 ? brand : '#5d7078';
          ctx.beginPath();
          ctx.arc(x, y, 0.85 + heat * 1.15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      frame = requestAnimationFrame(tick);
    }

    function move(e: PointerEvent) {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      el.style.setProperty('--mx', `${px}px`);
      el.style.setProperty('--my', `${py}px`);
      el.style.setProperty('--mouse', '1');
    }
    function leave() {
      px = -9999;
      py = -9999;
      el.style.setProperty('--mouse', '0');
    }

    function preference() {
      const still = media.matches;
      setReduced(still);
      cancelAnimationFrame(frame);
      frame = 0;
      if (still) {
        setIntroHidden(false);
        setRevealed(true);
        setReleasing(true);
        ctx?.clearRect(0, 0, w, h);
        return;
      }
      resize();
      frame = requestAnimationFrame(tick);
    }

    preference();
    const ro = new ResizeObserver(() => !media.matches && resize());
    ro.observe(el);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    media.addEventListener('change', preference);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      media.removeEventListener('change', preference);
    };
  }, []);

  function explore() {
    setOpen(false);
    const wrap = outer.current;
    const el = stage.current;
    if (reduced || !wrap || !el) {
      document.getElementById('complex')?.scrollIntoView();
      return;
    }
    const travel = wrap.offsetHeight - el.clientHeight;
    scrollTo({ top: wrap.offsetTop + travel * 0.62, behavior: 'smooth' });
  }

  const brand = (
    <span className="wordmark">
      GIGA<span>MINES</span>
      <i />
    </span>
  );

  return (
    <>
      <a
        className="skip"
        href="#complex"
        onClick={(e) => {
          e.preventDefault();
          explore();
        }}
      >
        Skip to the complex
      </a>

      <section className="hero-scroll" ref={outer}>
        <div className="hero-stage" ref={stage}>
          <canvas ref={canvas} className="dots" aria-hidden="true" />
          <div className="pointer-glow" aria-hidden="true" />

          <header className="hero-nav" inert={introHidden}>
            <a className="nav-brand" href="/" aria-label="GigaMines home">
              {brand}
            </a>
            <span className="nav-divide" aria-hidden="true" />
            <nav aria-label="Primary">
              {sections.map((s) => (
                <a key={s.slug} href={`/${s.slug}`}>
                  {s.name}
                </a>
              ))}
            </nav>
            <a className="contact" href="mailto:info@m-mines.com" aria-label="Partner with us">
              <ArrowUpRight size={16} />
            </a>
            <button className="mobile-menu" aria-label="Open navigation" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
          </header>

          <div className="orbit" aria-hidden="true">
            <div />
          </div>

          <h1 className="hero-title">
            <span className="upper">CRITICAL MINERALS.</span>
            <span className="lower">RENEWED POTENTIAL.</span>
          </h1>

          <div className="scroll-cue" inert={introHidden}>
            <button onClick={explore}>
              SCROLL TO DISCOVER <ArrowDown size={15} />
            </button>
          </div>

          <div className="marquee" aria-hidden="true" inert={introHidden}>
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy}>
                  {stream.map((item) => (
                    <span key={item}>
                      {item}
                      <i style={{ display: 'inline-block', marginLeft: 30 }} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* --- The reveal: the Giga Complex --------------------------- */}
          <section id="complex" className="scene" aria-label="The Giga Complex" inert={!revealed}>
            <Complex revealed={revealed} />

            <div className="scene-top">
              <a href="/">{brand}</a>
              <span>RECYCLE / RECOVER / REFINE</span>
            </div>

            <div className="scene-head">
              <span className="scene-index">01 / THE GIGA COMPLEX</span>
              <h2>
                Inside
                <br />
                <em>G-HUB.</em>
              </h2>
              <p>
                India&rsquo;s first integrated giga-scale critical mineral and rare earth refining complex. Fifty acres,
                one continuous circuit from feedstock to refined metal.
              </p>
            </div>

            {/* Narrow screens: the pills cannot sit on the model without
                colliding, so the same links become a swipeable rail. */}
            <div className="hotspot-rail">
              {capabilities.map((c) => (
                <a key={c.slug} className="hotspot" href={`/capabilities/${c.slug}`} tabIndex={revealed ? 0 : -1}>
                  <span className="dot">{c.index}</span>
                  {c.name}
                  {c.status && <small>{c.status}</small>}
                </a>
              ))}
            </div>

            <div className="scene-foot">
              <span>50 ACRES &middot; PHASE I</span>
              <div className="model-status">
                <i />
                Interactive 3D model &middot; in development
              </div>
            </div>

            <div className={`hold-cue ${releasing ? 'releasing' : ''}`} aria-hidden="true">
              <span className="hold-dwell">TAKE A LOOK AROUND</span>
              <span className="hold-next">
                KEEP SCROLLING <ArrowDown size={14} />
              </span>
            </div>
          </section>

          <Sheet open={open} onOpenChange={setOpen}>
            <div className={`context-menu ${revealed ? 'visible' : ''}`} inert={!revealed}>
              <SheetTrigger className="menu-capsule" aria-label="Open the complex menu">
                <span className="number">01</span>
                <span>The Giga Complex</span>
                <span className="menu-circle">
                  <Menu size={18} />
                </span>
              </SheetTrigger>
            </div>
            <SheetContent className="explore-sheet">
              <SheetTitle className="sheet-title">
                Explore GigaMines<span>.</span>
              </SheetTitle>
              <SheetDescription>Critical minerals. Renewed potential.</SheetDescription>
              <nav className="chapter-links" aria-label="Explore">
                {capabilities.map((c) => (
                  <a key={c.slug} href={`/capabilities/${c.slug}`}>
                    <span>
                      <small>{c.index}</small>
                      {c.name}
                      {c.status && <em>{c.status}</em>}
                    </span>
                    <ArrowUpRight />
                  </a>
                ))}
                {sections.map((s) => (
                  <a key={s.slug} href={`/${s.slug}`}>
                    <span>
                      <small>&mdash;</small>
                      {s.name}
                    </span>
                    <ArrowUpRight />
                  </a>
                ))}
              </nav>
              <a className="partner-link" href="mailto:info@m-mines.com">
                Partner with us <ArrowUpRight size={18} />
              </a>
              <p className="sheet-note">A MiniMines Cleantech Solutions venture</p>
            </SheetContent>
          </Sheet>

          <div className="progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>
    </>
  );
}
