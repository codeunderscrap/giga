import { ArrowUpRight } from 'lucide-react';

/* Figures confirmed in the G-HUB two-pager. Everything the requirements sheet
   still lists as future scope is shown as an explicit placeholder rather than
   an invented number — section 11, open items. */
const figures = [
  { value: '50', unit: 'acres', label: 'Industrial land parcel', note: 'Refining utilities and expansion' },
  { value: '~13,700', unit: 'MTPA', label: 'Combined product output', note: 'Across ten refined streams' },
  { value: '10', unit: 'products', label: 'Refined output streams', note: 'Salts, metals and battery materials' },
  { value: '4', unit: 'feed types', label: 'Multi-feed intake', note: 'Batteries, ore, industrial waste, tailings' },
];

const pending = [
  { label: 'Employment', note: 'Headcount to be confirmed' },
  { label: 'Processing capacity', note: 'Figures to be confirmed' },
  { label: 'CO₂ saved', note: 'Methodology to be confirmed' },
];

const timeline = [
  { when: '0 months', what: 'Site development & permits' },
  { when: '6–8 months', what: 'Clearances & approvals' },
  { when: '12–16 months', what: 'Construction & equipment commissioning' },
  { when: '18–24 months', what: 'Full-scale production' },
];

export default function Stats() {
  return (
    <>
      <section className="stats" id="scale" aria-labelledby="scale-heading">
        <div className="section-head">
          <span className="section-index">02 / SCALE</span>
          <h2 id="scale-heading">
            Built for
            <br />
            <em>giga demand.</em>
          </h2>
          <p>
            One integrated complex sized for the volumes India&rsquo;s gigafactories will need — and designed so a
            single circuit can take batteries, ore concentrates, industrial waste and tailings.
          </p>
        </div>

        <div className="figure-grid">
          {figures.map((f) => (
            <div className="figure" key={f.label}>
              <strong>
                {f.value}
                <span>{f.unit}</span>
              </strong>
              <h3>{f.label}</h3>
              <p>{f.note}</p>
            </div>
          ))}
          {pending.map((p) => (
            <div className="figure pending" key={p.label}>
              <strong>
                &mdash;<span>TBC</span>
              </strong>
              <h3>{p.label}</h3>
              <p>{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="timeline" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="rail-heading">
          Project timeline
        </h2>
        <ol className="rail">
          {timeline.map((t, i) => (
            <li key={t.when}>
              <span className="rail-dot">{String(i + 1).padStart(2, '0')}</span>
              <strong>{t.when}</strong>
              <p>{t.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ecosystem" aria-labelledby="ecosystem-heading">
        <div>
          <span className="section-index">03 / ECOSYSTEM</span>
          <h2 id="ecosystem-heading">
            Government &amp; institutional support
          </h2>
          <p>
            MiniMines is engaging MSME, APICC and the state industrial ecosystem on project facilitation and
            validation, manufacturing category inclusion, industrial approvals, and subsidy and incentive alignment.
          </p>
          <p className="footnote">Association and grant marks will appear here once confirmed.</p>
        </div>
        <a className="cta" href="mailto:info@m-mines.com">
          <span>
            <small>PARTNER WITH US</small>
            Build the circuit with us
          </span>
          <ArrowUpRight size={22} />
        </a>
      </section>
    </>
  );
}
