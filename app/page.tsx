import Hero from './hero';
import Sections from './sections';
import SiteFooter from './site-footer';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Sections />
      </main>
      <SiteFooter />
    </>
  );
}
