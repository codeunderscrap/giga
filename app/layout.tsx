import type { Metadata } from 'next';
import './globals.css';
import ScrollRail from './scroll-rail';

export const metadata: Metadata = {
  title: 'GigaMines — Critical minerals. Renewed potential.',
  description:
    'A MiniMines venture. India’s first integrated giga-scale critical mineral and rare earth extraction and refining complex.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ScrollRail />
        {children}
      </body>
    </html>
  );
}
