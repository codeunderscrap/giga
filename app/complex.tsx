'use client';
/* ---------------------------------------------------------------------------
   The Giga Complex — a turntable massing model of the G-HUB site.

   Placeholder geometry for the real 3D model, but genuinely dimensional: the
   site is held in grid space, rotated about its centre, then projected. Drag
   (or arrow-key) the yaw and every block re-projects, back faces cull, and the
   draw order re-sorts. The hotspots run through the same projection, so a pill
   stays welded to its building at any angle.

   Site contents follow the G-HUB two-pager: research centre, testing labs,
   hydrometallurgical and metal production units, mechanical pre-treatment,
   warehousing, ETP/ZLD water systems, a renewable power zone and a rail siding.
--------------------------------------------------------------------------- */
import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { capabilities } from './capabilities';

export const VIEW_X = 0;
export const VIEW_Y = 130;
export const VIEW_W = 1600;
export const VIEW_H = 700;

const S = 40; // tile size
const OX = 980; // screen x of the site centre
const OY = 572; // screen y of the site centre
const CX = 7; // site centre, grid space
const CY = 7;
const BASE = Math.PI / 4; // opening angle: the familiar three-quarter view
const H_SCALE = 1.2; // horizontal spread
const V_SCALE = 0.62; // ground-plane foreshortening — a fixed camera pitch

/* A true axonometric turntable: the plan spins under a camera whose pitch never
   changes, so no angle collapses the model into a flat elevation. */
function spin(x: number, y: number, yaw: number): [number, number] {
  const dx = x - CX;
  const dy = y - CY;
  const a = yaw + BASE;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [dx * c - dy * s, dx * s + dy * c];
}

/** Rotate, then project to the artwork's screen space. */
export function project(x: number, y: number, z: number, yaw: number): [number, number] {
  const [rx, ry] = spin(x, y, yaw);
  return [OX + rx * S * H_SCALE, OY + ry * S * V_SCALE - z * S];
}

/** Painter's-algorithm depth: further from the camera is smaller. */
const depthOf = (x: number, y: number, yaw: number) => spin(x, y, yaw)[1];

/** Projected point as a percentage of the artwork window, for HTML overlays. */
export function projectPercent(x: number, y: number, z: number, yaw: number) {
  const [sx, sy] = project(x, y, z, yaw);
  return { left: `${((sx - VIEW_X) / VIEW_W) * 100}%`, top: `${((sy - VIEW_Y) / VIEW_H) * 100}%` };
}

const poly = (pts: [number, number][]) => pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ');

/* --- Palette -------------------------------------------------------------- */
const ROOF = '#3b5665';
const LIT = '#2d4552';
const SHADE = '#1a2a33';

type Block = {
  id: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  base?: number;
  roof?: string;
  lit?: string;
  shade?: string;
  /** Rows of lit window bands below the roofline. */
  windows?: number;
};

type Cylinder = { id: string; x: number; y: number; r: number; h: number; cap?: string };
type Flat = { id: string; x: number; y: number; w: number; d: number; fill: string; z?: number };

/* --- Site plan ------------------------------------------------------------ */
const flats: Flat[] = [
  { id: 'road-a', x: 0.4, y: 7.8, w: 13.2, d: 0.55, fill: '#16242c' },
  { id: 'road-b', x: 5.3, y: 0.4, w: 0.55, d: 13.2, fill: '#16242c' },
  { id: 'yard', x: 5.2, y: 9.5, w: 1.2, d: 3.5, fill: '#16242c' },
  { id: 'etp-1', x: 11.2, y: 9, w: 2.2, d: 1.7, fill: '#0f5a6b', z: 0.06 },
  { id: 'etp-2', x: 11.2, y: 11, w: 2.2, d: 1.7, fill: '#12707f', z: 0.06 },
  { id: 'rail', x: 13.2, y: 5, w: 0.5, d: 8.4, fill: '#233741', z: 0.05 },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `solar-${i}`,
    x: 6.2 + Math.floor(i / 3) * 0.78,
    y: 0.5 + (i % 3) * 0.95,
    w: 0.6,
    d: 0.75,
    fill: '#1d4b5c',
    z: 0.35,
  })),
];

const blocks: Block[] = [
  /* QA/QC — testing and assay laboratories */
  { id: 'qa', x: 1, y: 0.6, w: 3, d: 2.8, h: 2.2, windows: 3 },
  { id: 'qa-tower', x: 3.4, y: 1.4, w: 0.9, d: 1.2, h: 2.9, roof: '#456575' },

  /* R&D — Critical Mineral & Rare Earth Research Centre */
  { id: 'rnd', x: 1, y: 4.5, w: 3, d: 3, h: 3, roof: '#456d80', lit: '#33505f', windows: 4 },
  { id: 'rnd-top', x: 1.6, y: 5.1, w: 1.8, d: 1.8, h: 3.5, roof: '#517d92', lit: '#3a5b6b' },

  /* Operations & People — administration and control */
  { id: 'ops', x: 11, y: 1, w: 2.6, d: 3, h: 2.6, windows: 3 },
  { id: 'ops-mast', x: 13.1, y: 1.6, w: 0.32, d: 0.32, h: 3.2, roof: '#4a6675' },
  { id: 'ops-beacon', x: 13.1, y: 1.6, w: 0.32, d: 0.32, h: 3.35, base: 3.2, roof: '#f47735', lit: '#9c4f26', shade: '#7a3d1e' },

  /* Warehousing — intake and dispatch sheds */
  { id: 'shed-a', x: 1, y: 9.5, w: 4, d: 1.6, h: 1.8, roof: '#47656f', lit: '#2e4854', windows: 1 },
  { id: 'shed-b', x: 1, y: 11.4, w: 4, d: 1.6, h: 1.8, roof: '#47656f', lit: '#2e4854', windows: 1 },

  /* Chemical processing — hydrometallurgical & metal production */
  { id: 'chem-hall', x: 8, y: 4, w: 2.2, d: 3.4, h: 2.4, roof: '#35505e' },
  { id: 'chem-stack', x: 8.6, y: 4.4, w: 0.34, d: 0.34, h: 4.1, roof: '#4a6675' },
  { id: 'chem-beacon', x: 8.6, y: 4.4, w: 0.34, d: 0.34, h: 4.28, base: 4.1, roof: '#f47735', lit: '#9c4f26', shade: '#7a3d1e' },
  { id: 'chem-vent', x: 9.4, y: 5.6, w: 0.3, d: 0.3, h: 3.4, roof: '#8ea3ad', lit: '#425966' },

  /* Mechanical processing — pre-treatment hall */
  { id: 'mech', x: 6.2, y: 8.6, w: 3.4, d: 3.2, h: 2.4, roof: '#3f5c6c', windows: 2 },
  { id: 'mech-annex', x: 9.7, y: 9.4, w: 0.7, d: 1.4, h: 1.6, roof: '#456575' },

  /* Rail siding wagons */
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `wagon-${i}`,
    x: 13.15,
    y: 5.6 + i * 1.5,
    w: 0.6,
    d: 1,
    h: 0.5,
    roof: ROOF,
  })),
];

const cylinders: Cylinder[] = [
  { id: 'tank-a', x: 10.9, y: 4.6, r: 0.62, h: 4.6 },
  { id: 'tank-b', x: 11.9, y: 5.4, r: 0.62, h: 3.9 },
  { id: 'tank-c', x: 10.7, y: 6.4, r: 0.5, h: 3.2 },
];

/* --- Rendering ------------------------------------------------------------ */

function BlockShape({ b, yaw }: { b: Block; yaw: number }) {
  const base = b.base ?? 0;
  const corners: [number, number][] = [
    [b.x, b.y],
    [b.x + b.w, b.y],
    [b.x + b.w, b.y + b.d],
    [b.x, b.y + b.d],
  ];
  const top = corners.map(([x, y]) => project(x, y, b.h, yaw));
  const foot = corners.map(([x, y]) => project(x, y, base, yaw));
  const cx = top.reduce((a, p) => a + p[0], 0) / 4;
  const cy = top.reduce((a, p) => a + p[1], 0) / 4;

  const walls = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    const mx = (top[i][0] + top[j][0]) / 2;
    const my = (top[i][1] + top[j][1]) / 2;
    if (my <= cy + 0.01) continue; // back face, cull it
    const lit = mx <= cx; // faces turned to the left catch the light
    walls.push(
      <polygon key={`w${i}`} fill={lit ? (b.lit ?? LIT) : (b.shade ?? SHADE)} points={poly([foot[i], foot[j], top[j], top[i]])} />,
    );
    if (b.windows) {
      for (let r = 0; r < b.windows; r++) {
        const z1 = b.h - 0.28 - r * 0.5;
        const z2 = z1 - 0.2;
        if (z2 <= base) break;
        walls.push(
          <polygon
            key={`w${i}-${r}`}
            fill="#f47735"
            opacity={(lit ? 0.5 : 0.34) - r * 0.08}
            points={poly([
              project(corners[i][0], corners[i][1], z1, yaw),
              project(corners[j][0], corners[j][1], z1, yaw),
              project(corners[j][0], corners[j][1], z2, yaw),
              project(corners[i][0], corners[i][1], z2, yaw),
            ])}
          />,
        );
      }
    }
  }

  return (
    <g>
      {walls}
      <polygon fill={b.roof ?? ROOF} points={poly(top as [number, number][])} />
    </g>
  );
}

function CylinderShape({ c, yaw }: { c: Cylinder; yaw: number }) {
  const [cx, yBase] = project(c.x, c.y, 0, yaw);
  const [, yTop] = project(c.x, c.y, c.h, yaw);
  const rx = c.r * S * 0.866;
  const ry = c.r * S * 0.5;
  return (
    <g>
      <path
        fill="#1f333e"
        d={`M ${cx - rx} ${yBase} L ${cx - rx} ${yTop} A ${rx} ${ry} 0 0 0 ${cx + rx} ${yTop} L ${cx + rx} ${yBase} A ${rx} ${ry} 0 0 1 ${cx - rx} ${yBase} Z`}
      />
      <ellipse cx={cx} cy={yTop} rx={rx} ry={ry} fill={c.cap ?? '#456575'} />
    </g>
  );
}

function FlatShape({ f, yaw }: { f: Flat; yaw: number }) {
  const z = f.z ?? 0.02;
  return (
    <polygon
      fill={f.fill}
      points={poly([
        project(f.x, f.y, z, yaw),
        project(f.x + f.w, f.y, z, yaw),
        project(f.x + f.w, f.y + f.d, z, yaw),
        project(f.x, f.y + f.d, z, yaw),
      ])}
    />
  );
}

function Artwork({ yaw }: { yaw: number }) {
  /* Flat pads never occlude anything, so they all go down first. Everything
     with height is sorted back-to-front for the current angle. */
  const standing = [
    ...blocks.map((b) => ({ kind: 'block' as const, item: b, depth: depthOf(b.x + b.w / 2, b.y + b.d / 2, yaw) })),
    ...cylinders.map((c) => ({ kind: 'cylinder' as const, item: c, depth: depthOf(c.x, c.y, yaw) })),
  ].sort((a, b) => a.depth - b.depth);

  const gridLines = [];
  for (let i = 1; i < 14; i++) {
    const a = project(i, 0, 0, yaw);
    const b = project(i, 14, 0, yaw);
    const c = project(0, i, 0, yaw);
    const d = project(14, i, 0, yaw);
    gridLines.push(
      <line key={`gx${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />,
      <line key={`gy${i}`} x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} />,
    );
  }

  return (
    <svg
      viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label="Rotatable schematic model of the GigaMines refining complex"
    >
      <defs>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2c35" />
          <stop offset="100%" stopColor="#0d181e" />
        </linearGradient>
        <radialGradient id="siteGlow" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#f47735" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#f47735" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={OX} cy={OY - 90} rx={600} ry={300} fill="url(#siteGlow)" />
      <polygon
        fill="url(#ground)"
        stroke="#2b414e"
        strokeWidth="1.5"
        points={poly([project(0, 0, 0, yaw), project(14, 0, 0, yaw), project(14, 14, 0, yaw), project(0, 14, 0, yaw)])}
      />
      <g stroke="#ffffff" strokeOpacity="0.045" strokeWidth="1">
        {gridLines}
      </g>
      {flats.map((f) => (
        <FlatShape key={f.id} f={f} yaw={yaw} />
      ))}
      {standing.map((s) =>
        s.kind === 'block' ? (
          <BlockShape key={s.item.id} b={s.item} yaw={yaw} />
        ) : (
          <CylinderShape key={s.item.id} c={s.item} yaw={yaw} />
        ),
      )}
    </svg>
  );
}

/* --- Public component ----------------------------------------------------- */

const START_YAW = 0;

export default function Complex({ revealed }: { revealed: boolean }) {
  const [yaw, setYaw] = useState(START_YAW);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ id: number; x: number; yaw: number } | null>(null);

  const onDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      drag.current = { id: e.pointerId, x: e.clientX, yaw };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(true);
    },
    [yaw],
  );

  const onMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    setYaw(d.yaw + ((e.clientX - d.x) / 260));
  }, []);

  const onUp = useCallback((e: React.PointerEvent) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
  }, []);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setYaw((y) => y - Math.PI / 12);
    else if (e.key === 'ArrowRight') setYaw((y) => y + Math.PI / 12);
    else if (e.key === 'Home') setYaw(START_YAW);
    else return;
    e.preventDefault();
  }, []);

  /* Reduced motion keeps the model at its established angle. */
  const [still, setStill] = useState(false);
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, []);

  return (
    <>
      <div
        className={`complex-fit art ${dragging ? 'grabbing' : ''}`}
        onPointerDown={still ? undefined : onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
        role={still ? undefined : 'slider'}
        aria-label={still ? undefined : 'Rotate the complex'}
        aria-valuetext={still ? undefined : `${Math.round((((yaw * 180) / Math.PI) % 360 + 360) % 360)} degrees`}
        tabIndex={revealed && !still ? 0 : -1}
      >
        <div className="complex-frame">
          <Artwork yaw={still ? START_YAW : yaw} />
        </div>
      </div>

      <div className="scene-scrim" aria-hidden="true" />

      <div className="complex-fit pins">
        <div className="complex-frame">
          {capabilities.map((c) => {
            const angle = still ? START_YAW : yaw;
            /* Pills stack by depth and the far side recedes, so an overlap at
               any given angle still reads front-to-back. */
            const depth = depthOf(c.anchor[0], c.anchor[1], angle);
            const near = (depth + 10) / 20;
            return (
              <a
                key={c.slug}
                className="hotspot"
                href={`/capabilities/${c.slug}`}
                style={{
                  ...projectPercent(c.anchor[0], c.anchor[1], c.anchor[2], angle),
                  zIndex: Math.round(depth * 100) + 2000,
                  opacity: 0.62 + near * 0.38,
                }}
                tabIndex={revealed ? 0 : -1}
              >
                <span className="dot">{c.index}</span>
                {c.name}
                {c.status && <small>{c.status}</small>}
              </a>
            );
          })}
        </div>
      </div>

      {!still && (
        <p className="rotate-hint" aria-hidden="true">
          <RotateCw size={13} /> Drag to rotate
        </p>
      )}
    </>
  );
}
