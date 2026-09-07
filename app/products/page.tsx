import { ArrowLeft } from 'lucide-react';
import Periodic from '../periodic';

export default function ProductsPage() {
  return (
    <main className="products-page">
      <header className="products-nav">
        <a className="page-back" href="/">
          <ArrowLeft size={15} /> GigaMines
        </a>
        <span className="products-crumb">Product output</span>
      </header>

      <div className="products-intro">
        <span className="section-index">Phase I</span>
        <h1>Product output</h1>
        <p>
          Ten refined streams out of one circuit. Select a product for its route through the complex and where it goes
          next. Tonnages are planned Phase&nbsp;I capacity.
        </p>
      </div>

      <Periodic />

      <footer className="products-foot">
        <span>A MiniMines Cleantech Solutions venture</span>
        <a href="mailto:info@m-mines.com">info@m-mines.com</a>
      </footer>
    </main>
  );
}
