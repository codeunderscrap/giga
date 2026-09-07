import type { Metadata } from 'next';
import './globals.css';
import ScrollRail from './scroll-rail';
import CustomCursor from './custom-cursor';

export const metadata: Metadata = {
  title: 'GigaMines — Critical minerals. Renewed potential.',
  description:
    'A MiniMines venture. India’s first integrated giga-scale critical mineral and rare earth extraction and refining complex.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* IBM Plex: a neo-grotesque commissioned for an industrial-technology
            company, with a mono companion for spec figures. Open-licensed, so
            no per-domain webfont fee for a corporate site. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <CustomCursor />
        <ScrollRail />
        {children}
      </body>
    </html>
  );
}
