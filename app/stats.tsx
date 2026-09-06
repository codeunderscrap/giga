import { ArrowUpRight } from 'lucide-react';

/* Figures confirmed in the G-HUB two-pager. Anything the requirements sheet
   still lists as future scope is held back to a single quiet line rather than
   given a card of its own — an unconfirmed number should not carry the same
   weight as a confirmed one. */
const spec = [
  { value: '50', unit: 'acres', label: 'Industrial land parcel', note: 'Refining utilities and expansion' },
  { value: '13,700', unit: 'MTPA', label: 'Combined product output', note: 'Across ten refined streams', approx: true },
  { value: '10', unit: 'streams', label: 'Refined product output', note: 'Salts, metals and battery materials' },
  { value: '04', unit: 'feed types', label: 'Multi-feed intake', note: 'Batteries · ore · industrial waste · tailings' },
];

const pending = ['Employment', 'Processing capacity', 'CO₂ saved'];

const phases = [
  { when: '0', unit: 'months', what: 'Site development & permits' },
  { when: '6–8', unit: 'months', what: 'Clearances & approvals' },
  { when: '12–16', unit: 'months', what: 'Construction & commissioning' },
  { when: '18–24', unit: 'months', what: 'Full-scale production' },
];

export default function Stats() {
  return (
    <>
      <section className="scale" id="scale" aria-labelledby="scale-heading">
        <div className="scale-head">
          <div>
            <span className="section-index">02 / SCALE</span>
            <h2 id="scale-heading">
              Built for
              <br />
              <em>giga demand.</em>
            </h2>
          </div>
          <p>
            One integrated complex, sized for the volumes India&rsquo;s gigafactories will need — and built so a single
            circuit can take batteries, ore concentrates, industrial waste and tailings.
          </p>
        </div>

        <dl className="spec">
          {spec.map((s) => (
            <div className="spec-row" key={s.label}>
              <dt>
                <span className="spec-value">
                  {s.approx && <i>~</i>}
                  {s.value}
                </span>
                <span className="spec-unit">{s.unit}</span>
              </dt>
              <dd>
                <strong>{s.label}</strong>
                <span>{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="spec-pending">
          <span>Pending confirmation</span>
          {pending.map((p) => (
            <em key={p}>{p}</em>
          ))}
        </p>
      </section>

      <section className="timeline" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="rule-heading">
          <span>Project timeline</span>
          <i />
          <small>Phase I</small>
        </h2>

        <ol className="track">
          {phases.map((p, i) => (
            <li key={p.when} className={i === phases.length - 1 ? 'is-last' : undefined}>
              <span className="track-node" aria-hidden="true" />
              <strong>
                {p.when}
                <em>{p.unit}</em>
              </strong>
              <p>{p.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ecosystem" aria-labelledby="ecosystem-heading">
        <h2 id="ecosystem-heading" className="rule-heading">
          <span>03 / Ecosystem</span>
          <i />
          <small>Government &amp; institutional</small>
        </h2>

        <div className="eco-grid">
          <p className="eco-lede">
            MiniMines is engaging MSME, APICC and the state industrial ecosystem on project facilitation and
            validation, manufacturing category inclusion, industrial approvals, and subsidy and incentive alignment.
          </p>
          <p className="eco-note">Association and grant marks will appear here once confirmed.</p>
        </div>

        <a className="eco-cta" href="mailto:info@m-mines.com">
          <span>
            <small>PARTNER WITH US</small>
            Build the circuit with us
          </span>
          <i>
            <ArrowUpRight size={20} />
          </i>
        </a>
      </section>
    </>
  );
}
