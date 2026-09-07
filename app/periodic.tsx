'use client';
/* ---------------------------------------------------------------------------
   Product output as a periodic table.

   The table is a real 3D object: a perspective stage that tilts with the
   pointer, each tile on its own Z plane. Selecting a product turns the table,
   parks it on the left, and opens the product beside it.

   The detail is tabbed rather than stacked, so no single view is dense, and
   the extraction route is a stepper you click through rather than a wall of
   process notes.
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

const TABS = ['Overview', 'Extraction route', 'Applications'] as const;
type Tab = (typeof TABS)[number];

export default function Periodic() {
  const [active, setActive] = useState<Product | null>(null);
  const [tab, setTab] = useState<Tab>('Overview');
  const [stage, setStage] = useState(0);
  const [still, setStill] = useState(false);
  const board = useRef<HTMLDivElement>(null);

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

  function pick(p: Product) {
    const same = active?.slug === p.slug;
    setActive(same ? null : p);
    if (!same) {
      setTab('Overview');
      setStage(0);
    }
  }

  /* Pointer tilt. Small range on purpose — it should read as a solid object
     catching the light, not a toy spinning. */
  const tilt = useCallback(
    (e: React.PointerEvent) => {
      if (still) return;
      const el = board.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--tilt-y', `${((e.clientX - r.x) / r.width - 0.5) * 14}deg`);
      el.style.setProperty('--tilt-x', `${-((e.clientY - r.y) / r.height - 0.5) * 10}deg`);
    },
    [still],
  );

  const rest = useCallback(() => {
    const el = board.current;
    el?.style.setProperty('--tilt-y', '0deg');
    el?.style.setProperty('--tilt-x', '0deg');
  }, []);

  const current = active?.stages[Math.min(stage, active.stages.length - 1)];

  return (
    <div className={`pt-layout ${active ? 'open' : ''}`}>
      <div className="pt-side">
        <div className="pt-perspective" onPointerMove={tilt} onPointerLeave={rest}>
          <div className="pt-stage" ref={board}>
            {products.map((p) => (
              <button
                key={p.slug}
                type="button"
                className={`pt-tile fam-${p.family} ${active?.slug === p.slug ? 'is-active' : ''}`}
                style={{ '--col': p.col, '--row': p.row } as React.CSSProperties}
                aria-pressed={active?.slug === p.slug}
                onClick={() => pick(p)}
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

      {active && current && (
        <article className="pt-detail" key={active.slug}>
          <button className="pt-close" type="button" onClick={() => setActive(null)} aria-label="Close product">
            <X size={17} />
          </button>

          <header className="pt-head">
            <span className="pt-eyebrow">
              {active.index} — {families[active.family].label}
            </span>
            <h2>{active.name}</h2>
            <p className="pt-formula">{active.formula}</p>
            <p className="pt-summary">{active.summary}</p>

            <ul className="pt-meta">
              <li>
                <span>Planned output</span>
                {active.mtpa} MTPA
              </li>
              <li>
                <span>Phase</span>I
              </li>
              <li>
                <span>Streams</span>
                {active.stages.length} stages
              </li>
            </ul>
          </header>

          <div className="pt-tabs" role="tablist" aria-label="Product detail">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                id={`tab-${t}`}
                aria-selected={tab === t}
                aria-controls={`panel-${t}`}
                className={tab === t ? 'is-on' : undefined}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Overview' && (
            <div className="pt-panel" role="tabpanel" id="panel-Overview" aria-labelledby="tab-Overview">
              <p className="pt-body">{active.detail}</p>
              <a className="pt-enquiry" href={`mailto:info@m-mines.com?subject=${encodeURIComponent(active.name)}`}>
                Enquire about {active.name} <ArrowUpRight size={15} />
              </a>
            </div>
          )}

          {tab === 'Extraction route' && (
            <div className="pt-panel" role="tabpanel" id="panel-Extraction route" aria-labelledby="tab-Extraction route">
              <ol className="stepper">
                {active.stages.map((s, i) => {
                  const Icon = stageIcons[s.icon];
                  return (
                    <li key={`${s.label}-${i}`} className={i <= stage ? 'done' : undefined}>
                      <button
                        type="button"
                        className={i === stage ? 'is-on' : undefined}
                        aria-current={i === stage ? 'step' : undefined}
                        onClick={() => setStage(i)}
                      >
                        <span className="step-node">
                          <Icon size={17} strokeWidth={1.4} />
                        </span>
                        <span className="step-label">{s.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="step-detail">
                <span className="step-count">
                  Stage {String(stage + 1).padStart(2, '0')} of {String(active.stages.length).padStart(2, '0')}
                </span>
                <h3>{current.label}</h3>
                <p>{current.note}</p>
              </div>

              <p className="pt-caveat">Indicative route. GigaMines&rsquo; confirmed flowsheet is in development.</p>
            </div>
          )}

          {tab === 'Applications' && (
            <div className="pt-panel" role="tabpanel" id="panel-Applications" aria-labelledby="tab-Applications">
              <ul className="pt-uses">
                {active.uses.map((u) => (
                  <li key={u.label}>
                    <strong>{u.label}</strong>
                    <p>{u.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
