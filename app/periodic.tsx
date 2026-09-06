'use client';
/* ---------------------------------------------------------------------------
   Product output as a periodic table.

   The table is a real 3D object: a perspective stage that tilts with the
   pointer, with each tile lifted on its own Z plane. Selecting a product turns
   the whole table, parks it on the left, and opens the product beside it —
   identity in the middle column, extraction route and applications on the right.
--------------------------------------------------------------------------- */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Cog,
  Filter,
  FlaskConical,
  Flame,
  Droplets,
  Package,
  Snowflake,
  Thermometer,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import { families, products, type Product, type StageIcon } from './products-data';

const stageIcons: Record<StageIcon, typeof Cog> = {
  intake: Truck,
  mechanical: Cog,
  leach: FlaskConical,
  purify: Filter,
  extract: Droplets,
  crystallise: Snowflake,
  electro: Zap,
  thermal: Flame,
  distil: Thermometer,
  dispatch: Package,
};

export default function Periodic() {
  const [active, setActive] = useState<Product | null>(null);
  const [still, setStill] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [active]);

  /* Pointer tilt. Small range on purpose — it should read as a solid object
     catching the light, not a toy spinning. */
  const tilt = useCallback(
    (e: React.PointerEvent) => {
      if (still) return;
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.x) / r.width - 0.5;
      const ny = (e.clientY - r.y) / r.height - 0.5;
      el.style.setProperty('--tilt-y', `${nx * 16}deg`);
      el.style.setProperty('--tilt-x', `${-ny * 12}deg`);
    },
    [still],
  );

  const rest = useCallback(() => {
    const el = stage.current;
    el?.style.setProperty('--tilt-y', '0deg');
    el?.style.setProperty('--tilt-x', '0deg');
  }, []);

  return (
    <div className={`pt-layout ${active ? 'open' : ''}`}>
      <div className="pt-side">
        <div className="pt-perspective" onPointerMove={tilt} onPointerLeave={rest}>
          <div className="pt-stage" ref={stage}>
            {products.map((p) => (
              <button
                key={p.slug}
                type="button"
                className={`pt-tile fam-${p.family} ${active?.slug === p.slug ? 'is-active' : ''}`}
                style={{ '--col': p.col, '--row': p.row } as React.CSSProperties}
                aria-pressed={active?.slug === p.slug}
                onClick={() => setActive(active?.slug === p.slug ? null : p)}
              >
                <span className="pt-index">{p.index}</span>
                <span className="pt-symbol">{p.symbol}</span>
                <span className="pt-name">{p.name}</span>
                <span className="pt-mtpa">{p.mtpa} MTPA</span>
              </button>
            ))}
          </div>
        </div>

        <ul className="pt-legend">
          {(Object.keys(families) as (keyof typeof families)[]).map((key) => (
            <li key={key} className={`fam-${key}`}>
              <i />
              <span>
                {families[key].label}
                <small>{families[key].hint}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {active && (
        <div className="pt-detail" key={active.slug}>
          <button className="pt-close" type="button" onClick={() => setActive(null)} aria-label="Close product">
            <X size={18} />
          </button>

          <div className="pt-about">
            <span className="pt-eyebrow">
              {active.index} / {families[active.family].label.toUpperCase()}
            </span>
            <h2>{active.name}</h2>
            <p className="pt-formula">{active.formula}</p>
            <p className="pt-summary">{active.summary}</p>
            <p className="pt-body">{active.detail}</p>
            <dl className="pt-spec">
              <div>
                <dt>Planned output</dt>
                <dd>{active.mtpa} MTPA</dd>
              </div>
              <div>
                <dt>Family</dt>
                <dd>{families[active.family].label}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Phase I</dd>
              </div>
            </dl>
            <a className="pt-enquiry" href={`mailto:info@m-mines.com?subject=${encodeURIComponent(active.name)}`}>
              Enquire about {active.name} <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="pt-process">
            <h3>Extraction route</h3>
            <ol className="flow">
              {active.stages.map((s, i) => {
                const Icon = stageIcons[s.icon];
                return (
                  <li key={`${s.label}-${i}`}>
                    <span className="flow-mark">
                      <Icon size={22} strokeWidth={1.1} />
                    </span>
                    <div>
                      <strong>
                        <em>{String(i + 1).padStart(2, '0')}</em>
                        {s.label}
                      </strong>
                      <p>{s.note}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="pt-caveat">Indicative route. GigaMines&rsquo; confirmed flowsheet is in development.</p>

            <h3 className="pt-uses-heading">Where it is used</h3>
            <ul className="pt-uses">
              {active.uses.map((u) => (
                <li key={u.label}>
                  <strong>{u.label}</strong>
                  <p>{u.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
