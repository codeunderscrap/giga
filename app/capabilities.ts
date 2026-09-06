export type Capability = {
  slug: string;
  name: string;
  status?: 'TBD';
  index: string;
  /* Anchor on the isometric complex grid: [x, y, height]. Projected to screen
     coordinates by the same transform that draws the artwork, so the hotspot
     always sits on top of the building it labels. */
  anchor: [number, number, number];
  summary: string;
  detail: string[];
};

/* Source: GIGA MINES Website Requirements & Reference Sheet, section 4.2,
   and the G-HUB two-pager (facility details). */
export const capabilities: Capability[] = [
  {
    slug: 'r-and-d',
    name: 'R&D',
    index: '01',
    anchor: [2.5, 6, 3.4],
    summary: 'Critical Mineral & Rare Earth Research Centre.',
    detail: [
      'A dedicated research centre for critical minerals and rare earth elements, working across hydrometallurgy, advanced chemistry and materials recovery.',
      'Process development for the multi-feed, multi-output refining systems that let a single complex accept black mass, ore concentrates, MHP and industrial waste streams.',
    ],
  },
  {
    slug: 'qa-qc',
    name: 'QA/QC',
    index: '02',
    anchor: [2.5, 2, 2.6],
    summary: 'Testing, assay and quality assurance.',
    detail: [
      'On-site testing and assay laboratories governing input feedstock characterisation and output purity.',
      'Quality control across every refined product stream, from lithium carbonate and cobalt sulphate through to graphite and NMP.',
    ],
  },
  {
    slug: 'chemical-processing',
    name: 'Chemical Processing',
    status: 'TBD',
    index: '03',
    anchor: [9.5, 5.5, 5.4],
    summary: 'Hydrometallurgical & metal production units.',
    detail: [
      'The refining core: hydrometallurgical extraction and metal production, supported by ETP and zero-liquid-discharge water systems.',
      'Detailed process content, technical data and capacity figures are to be confirmed.',
    ],
  },
  {
    slug: 'operations-and-people',
    name: 'Operations & People',
    index: '04',
    anchor: [12.5, 2.5, 3],
    summary: 'The teams and systems that run the complex.',
    detail: [
      'Plant operations, maintenance, safety, and the skilled industrial employment the complex creates locally.',
      'Led by a founding team spanning chemical and polymer engineering, nanotechnology, and five decades of petrochemical and polymer plant delivery in India and overseas.',
    ],
  },
  {
    slug: 'mechanical-processing',
    name: 'Mechanical Processing',
    status: 'TBD',
    index: '05',
    anchor: [7.5, 10.5, 2.8],
    summary: 'Front-end size reduction and separation.',
    detail: [
      'Mechanical pre-treatment of spent lithium-ion batteries and industrial scrap ahead of the hydrometallurgical circuit.',
      'Detailed process content, equipment and capacity figures are to be confirmed.',
    ],
  },
  {
    slug: 'warehousing',
    name: 'Warehousing',
    index: '06',
    anchor: [2.6, 11.5, 2.6],
    summary: 'Feedstock intake and refined product dispatch.',
    detail: [
      'Warehousing, testing and dispatch zones sited beside a railway dockyard and close to cell manufacturing facilities.',
      'Handles inbound feedstock and outbound refined material bound for EV, battery manufacturing, metallurgy and allied industries.',
    ],
  },
];

export const bySlug = (slug: string) => capabilities.find((c) => c.slug === slug);

/* Primary site navigation, per section 3 of the requirements sheet. */
export const sections = [
  { slug: 'technology', name: 'Technology' },
  { slug: 'products', name: 'Products' },
  { slug: 'services', name: 'Services' },
  { slug: 'about', name: 'About' },
];
