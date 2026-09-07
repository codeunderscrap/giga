export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <div>
        <span className="foot-mark">
          GIGA<span>MINES</span>
          <i />
        </span>
        <p>A MiniMines Cleantech Solutions venture</p>
      </div>
      <nav aria-label="Footer">
        <a href="/products">Product output</a>
        <a href="mailto:info@m-mines.com">info@m-mines.com</a>
      </nav>
      <small>&copy; {new Date().getFullYear()} MiniMines Cleantech Solutions</small>
    </footer>
  );
}
