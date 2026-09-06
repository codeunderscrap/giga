import { ArrowLeft } from 'lucide-react';
import { capabilities, sections } from './capabilities';

export type PlaceholderProps = {
  index: string;
  title: string;
  status?: string;
  lede: string;
  body: string[];
  current: string;
};

/* Every page below the hero is a shell for now: correct structure, correct
   voice, no invented facts. Each one states plainly what is still to be
   confirmed, per section 11 of the requirements sheet. */
export default function Placeholder({ index, title, status, lede, body, current }: PlaceholderProps) {
  return (
    <main className="page-shell">
      <a className="page-back" href="/">
        <ArrowLeft size={16} /> Back to the complex
      </a>

      <div className="page-eyebrow">
        <span>{index}</span>
        <span>GIGAMINES</span>
      </div>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
      {body.map((p) => (
        <p className="body" key={p}>
          {p}
        </p>
      ))}

      <div className="status-chip">
        <i />
        {status ?? 'Detailed content in development'}
      </div>

      <nav className="page-nav" aria-label="Other sections">
        {capabilities.map((c) => (
          <a key={c.slug} href={`/capabilities/${c.slug}`} aria-current={current === c.slug ? 'page' : undefined}>
            {c.name}
          </a>
        ))}
        {sections.map((s) => (
          <a key={s.slug} href={`/${s.slug}`} aria-current={current === s.slug ? 'page' : undefined}>
            {s.name}
          </a>
        ))}
      </nav>
    </main>
  );
}
