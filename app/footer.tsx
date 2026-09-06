import { ArrowUpRight } from 'lucide-react';
import { capabilities, sections } from './capabilities';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="wordmark">
            GIGA<span>MINES</span>
            <i />
          </span>
          <p className="tagline">Extracting what matters.</p>
          <p className="footer-note">
            India&rsquo;s first integrated giga-scale critical mineral and rare earth extraction and refining complex.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <div>
            <h3>Site</h3>
            {sections.map((s) => (
              <a key={s.slug} href={`/${s.slug}`}>
                {s.name}
              </a>
            ))}
          </div>
          <div>
            <h3>The complex</h3>
            {capabilities.map((c) => (
              <a key={c.slug} href={`/capabilities/${c.slug}`}>
                {c.name}
              </a>
            ))}
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:info@m-mines.com">
              info@m-mines.com <ArrowUpRight size={13} />
            </a>
            <p className="footer-note">Social channels to be confirmed.</p>
          </div>
        </nav>
      </div>

      <div className="footer-strip" aria-hidden="true">
        RECYCLE <i /> RECOVER <i /> REFINE
      </div>

      <div className="footer-base">
        <span>&copy; {new Date().getFullYear()} MiniMines Cleantech Solutions</span>
        <span>A MiniMines venture &middot; Built on possibility, rooted in India</span>
      </div>
    </footer>
  );
}
