export type Capability = {
  slug: string;
  name: string;
  status?: 'TBD';
  index: string;
  /* Anchor on the isometric complex grid: [x, y, height]. Projected by the
     same transform that draws the artwork, so the pill stays on its building. */
  anchor: [number, number, number];
  summary: string;
};

/* Source: GIGA MINES Website Requirements & Reference Sheet, section 4.2,
   and the G-HUB two-pager. One line each — the model is for orientation, not
   for reading. */
export const capabilities: Capability[] = [
  {
    slug: 'r-and-d',
    name: 'R&D',
    index: '01',
    anchor: [2.5, 6, 3.4],
    summary: 'Critical Mineral & Rare Earth Research Centre.',
  },
  {
    slug: 'qa-qc',
    name: 'QA/QC',
    index: '02',
    anchor: [2.5, 2, 2.6],
    summary: 'Testing, assay and quality assurance across every stream.',
  },
  {
    slug: 'chemical-processing',
    name: 'Chemical Processing',
    status: 'TBD',
    index: '03',
    anchor: [9.5, 5.5, 5.4],
    summary: 'Hydrometallurgical extraction and metal production.',
  },
  {
    slug: 'operations-and-people',
    name: 'Operations & People',
    index: '04',
    anchor: [12.5, 2.5, 3],
    summary: 'Plant operations, maintenance, safety and skilled employment.',
  },
  {
    slug: 'mechanical-processing',
    name: 'Mechanical Processing',
    status: 'TBD',
    index: '05',
    anchor: [7.5, 10.5, 2.8],
    summary: 'Front-end size reduction and physical separation.',
  },
  {
    slug: 'warehousing',
    name: 'Warehousing',
    index: '06',
    anchor: [2.6, 11.5, 2.6],
    summary: 'Feedstock intake and refined product dispatch, beside the rail siding.',
  },
];
