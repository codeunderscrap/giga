import { ArrowLeft } from 'lucide-react';
import Periodic from '../periodic';
import Footer from '../footer';
import { sections } from '../capabilities';

export default function ProductsPage() {
  return (
    <>
      <main className="products-page">
        <header className="products-nav">
          <a className="page-back" href="/">
            <ArrowLeft size={16} /> Back to the complex
          </a>
          <nav aria-label="Primary">
            {sections.map((s) => (
              <a key={s.slug} href={`/${s.slug}`} aria-current={s.slug === 'products' ? 'page' : undefined}>
                {s.name}
              </a>
            ))}
          </nav>
        </header>

        <div className="products-intro">
          <span className="section-index">P / PRODUCT OUTPUT</span>
          <h1>
            Ten streams
            <br />
            <em>out of one circuit.</em>
          </h1>
          <p>
            Everything the complex recovers, laid out as a table. Select a product to see how it comes out of the
            circuit and where it goes next. Tonnages are planned Phase I capacity.
          </p>
        </div>

        <Periodic />
      </main>
      <Footer />
    </>
  );
}
