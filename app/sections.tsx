import { ArrowUpRight } from 'lucide-react';

/* Four figures, all confirmed in the G-HUB two-pager. The unconfirmed ones sit
   in one line underneath rather than taking equal billing — an investor should
   be able to tell at a glance which numbers are real. */
const figures = [
  { value: '50', unit: 'acres', label: 'Industrial land parcel', note: 'Refining utilities and expansion' },
  { value: '13,700', approx: true, unit: 'MTPA', label: 'Combined product output', note: 'Across ten refined streams' },
  { value: '10', unit: 'streams', label: 'Refined product output', note: 'Salts, metals and battery materials' },
  { value: '04', unit: 'feeds', label: 'Multi-feed intake', note: 'Batteries, ore, industrial waste, tailings' },
];

const phases = [
  { when: '0', unit: 'months', what: 'Site development & permits' },
  { when: '6–8', unit: 'months', what: 'Clearances & approvals' },
  { when: '12–16', unit: 'months', what: 'Construction & commissioning' },
  { when: '18–24', unit: 'months', what: 'Full-scale production' },
];

export default function Sections() {
  return (
    <div className="band">
      <section className="scale" id="scale" aria-labelledby="scale-heading">
        <div className="band-head">
          <span className="section-index">02 — Scale</span>
          <h2 id="scale-heading">Built for giga demand</h2>
          <p>
            One integrated complex, sized for the volumes India&rsquo;s gigafactories will need — and built so a single
            circuit can take batteries, ore concentrates, industrial waste and tailings.
          </p>
        </div>

        <dl className="figures">
          {figures.map((f) => (
            <div key={f.label}>
              <dt>
                {f.approx && <i>~</i>}
                {f.value}
                <span>{f.unit}</span>
              </dt>
              <dd>
                <strong>{f.label}</strong>
                {f.note}
              </dd>
            </div>
          ))}
        </dl>

        <p className="figures-note">
          Employment, processing capacity and CO&#8322; savings to be confirmed.
        </p>
      </section>

      <section className="timeline" aria-labelledby="timeline-heading">
        <div className="band-head narrow">
          <span className="section-index">03 — Timeline</span>
          <h2 id="timeline-heading">Phase I to full-scale production</h2>
        </div>

        <ol className="track">
          {phases.map((p, i) => (
            <li key={p.when} className={i === phases.length - 1 ? 'is-last' : undefined}>
              <span className="track-node" aria-hidden="true" />
              <strong>
                {p.when}
                <span>{p.unit}</span>
              </strong>
              <p>{p.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="partner" aria-labelledby="partner-heading">
        <div>
          <span className="section-index">04 — Partnership</span>
          <h2 id="partner-heading">Build the circuit with us</h2>
          <p>
            MiniMines is engaging MSME, APICC and the state industrial ecosystem on project facilitation, manufacturing
            category inclusion, industrial approvals and incentive alignment.
          </p>
        </div>
        <a className="partner-cta" href="mailto:info@m-mines.com">
          Partner with us
          <i>
            <ArrowUpRight size={18} />
          </i>
        </a>
      </section>
    </div>
  );
}
