/* ---------------------------------------------------------------------------
   Product output, taken from the G-HUB two-pager's Product Output table.
   Tonnages are the two-pager's own figures and still carry its "~" — they are
   projected Phase I capacity, not audited throughput.

   Process routes below describe the standard hydrometallurgical steps for each
   stream. They are indicative until GigaMines confirms its own flowsheet, and
   the page says so on the record.
--------------------------------------------------------------------------- */

export type Stage = { icon: StageIcon; label: string; note: string };
export type StageIcon =
  | 'intake'
  | 'mechanical'
  | 'leach'
  | 'purify'
  | 'extract'
  | 'crystallise'
  | 'electro'
  | 'thermal'
  | 'distil'
  | 'dispatch';

export type Product = {
  slug: string;
  symbol: string;
  name: string;
  formula: string;
  mtpa: string;
  family: 'salt' | 'metal' | 'carbon';
  /* Position on the table. Two blocks, split like a periodic table. */
  col: number;
  row: number;
  index: string;
  summary: string;
  detail: string;
  stages: Stage[];
  uses: { label: string; note: string }[];
};

const FEED: Stage = { icon: 'intake', label: 'Feed intake', note: 'Black mass, ore concentrates, MHP, industrial waste' };
const PRE: Stage = { icon: 'mechanical', label: 'Pre-treatment', note: 'Discharge, size reduction, physical separation' };
const LEACH: Stage = { icon: 'leach', label: 'Leaching', note: 'Metals taken into solution' };
const PURIFY: Stage = { icon: 'purify', label: 'Purification', note: 'Iron, aluminium and residual impurities removed' };

export const products: Product[] = [
  {
    slug: 'lithium-carbonate',
    symbol: 'Li',
    name: 'Lithium Carbonate',
    formula: 'Li₂CO₃',
    mtpa: '~1,600',
    family: 'salt',
    col: 1,
    row: 1,
    index: '01',
    summary: 'The lithium unit of the circuit, recovered from spent cells and concentrates.',
    detail:
      'Lithium reports to the raffinate once cobalt, nickel and copper have been taken out, and is concentrated and carbonated to a battery-grade carbonate. It is the stream that closes the loop most visibly: lithium out of end-of-life cells and back into new ones.',
    stages: [
      FEED,
      PRE,
      LEACH,
      PURIFY,
      { icon: 'extract', label: 'Metal separation', note: 'Co, Ni and Cu removed; lithium stays in solution' },
      { icon: 'crystallise', label: 'Carbonation', note: 'Precipitated as carbonate, then crystallised and dried' },
    ],
    uses: [
      { label: 'Cathode precursors', note: 'LFP and NMC cathode manufacture' },
      { label: 'Glass & ceramics', note: 'Flux and thermal-shock resistance' },
      { label: 'Industrial chemistry', note: 'Feedstock for other lithium compounds' },
    ],
  },
  {
    slug: 'cobalt-sulphate',
    symbol: 'Co',
    name: 'Cobalt Sulphate',
    formula: 'CoSO₄·7H₂O',
    mtpa: '~2,100',
    family: 'salt',
    col: 2,
    row: 1,
    index: '02',
    summary: 'Battery-grade cobalt salt, the highest-tonnage stream on the site.',
    detail:
      'Cobalt is separated from the purified leach liquor by solvent extraction, stripped into a clean sulphate solution and crystallised. It goes back into the cathode supply chain rather than to smelters.',
    stages: [
      FEED,
      PRE,
      LEACH,
      PURIFY,
      { icon: 'extract', label: 'Solvent extraction', note: 'Cobalt selectively loaded and stripped' },
      { icon: 'crystallise', label: 'Crystallisation', note: 'Sulphate crystallised, centrifuged and dried' },
    ],
    uses: [
      { label: 'Cathode precursors', note: 'NMC and LCO precursor production' },
      { label: 'Catalysts', note: 'Petrochemical and chemical processing' },
      { label: 'Pigments & driers', note: 'Ceramics, glass and coatings' },
    ],
  },
  {
    slug: 'nickel-sulphate',
    symbol: 'Ni',
    name: 'Nickel Sulphate',
    formula: 'NiSO₄·6H₂O',
    mtpa: '~1,500',
    family: 'salt',
    col: 3,
    row: 1,
    index: '03',
    summary: 'The nickel unit that high-nickel cathode chemistries are built on.',
    detail:
      'Nickel follows cobalt through solvent extraction and is crystallised as a hexahydrate sulphate. Demand for this stream tracks the industry shift toward higher-nickel, lower-cobalt cathodes.',
    stages: [
      FEED,
      PRE,
      LEACH,
      PURIFY,
      { icon: 'extract', label: 'Solvent extraction', note: 'Nickel separated from the cobalt raffinate' },
      { icon: 'crystallise', label: 'Crystallisation', note: 'Sulphate crystallised and dried' },
    ],
    uses: [
      { label: 'Cathode precursors', note: 'High-nickel NMC and NCA' },
      { label: 'Electroplating', note: 'Nickel plating baths' },
      { label: 'Specialty chemistry', note: 'Catalysts and nickel compounds' },
    ],
  },
  {
    slug: 'aluminium-carbonate',
    symbol: 'Al',
    name: 'Aluminium Carbonate',
    formula: 'Al · CO₃',
    mtpa: '~1,700',
    family: 'salt',
    col: 4,
    row: 1,
    index: '04',
    summary: 'Aluminium recovered from the purification stage rather than sent to residue.',
    detail:
      'Aluminium enters the circuit from cathode foil and casings. Instead of leaving as a waste hydroxide, it is precipitated as a saleable carbonate — one of the choices that keeps the site closer to zero residue.',
    stages: [
      FEED,
      PRE,
      LEACH,
      { icon: 'purify', label: 'Impurity stage', note: 'Aluminium taken out ahead of metal separation' },
      { icon: 'crystallise', label: 'Precipitation', note: 'Recovered as a carbonate, washed and dried' },
    ],
    uses: [
      { label: 'Refractories & alumina', note: 'Feedstock for aluminium chemistry' },
      { label: 'Water treatment', note: 'Coagulant production' },
      { label: 'Fillers', note: 'Industrial fillers and additives' },
    ],
  },
  {
    slug: 'cobalt-metal',
    symbol: 'Co',
    name: 'Cobalt Metal',
    formula: 'Co',
    mtpa: '~1,000',
    family: 'metal',
    col: 1,
    row: 2,
    index: '05',
    summary: 'Cathode-grade cobalt metal produced by electrowinning.',
    detail:
      'Where a customer needs metal rather than salt, the purified cobalt solution is taken to the electrowinning cells and plated out. The metal production units sit alongside the hydrometallurgical circuit for exactly this reason.',
    stages: [
      FEED,
      PRE,
      LEACH,
      PURIFY,
      { icon: 'extract', label: 'Solvent extraction', note: 'Clean cobalt electrolyte prepared' },
      { icon: 'electro', label: 'Electrowinning', note: 'Cobalt plated onto cathodes, stripped and cut' },
    ],
    uses: [
      { label: 'Superalloys', note: 'Turbine and high-temperature components' },
      { label: 'Hard metals', note: 'Cemented carbide binders and tooling' },
      { label: 'Magnets', note: 'Cobalt-bearing permanent magnets' },
    ],
  },
  {
    slug: 'nickel-metal',
    symbol: 'Ni',
    name: 'Nickel Metal',
    formula: 'Ni',
    mtpa: '~1,000',
    family: 'metal',
    col: 2,
    row: 2,
    index: '06',
    summary: 'Electrowon nickel for alloy and plating markets.',
    detail:
      'The same electrowinning route as cobalt, run on a purified nickel electrolyte. It gives the complex a second outlet for nickel units when the sulphate market is not the right destination.',
    stages: [
      FEED,
      PRE,
      LEACH,
      PURIFY,
      { icon: 'extract', label: 'Solvent extraction', note: 'Clean nickel electrolyte prepared' },
      { icon: 'electro', label: 'Electrowinning', note: 'Nickel plated, stripped and cut' },
    ],
    uses: [
      { label: 'Stainless steel', note: 'Austenitic stainless production' },
      { label: 'Alloys', note: 'Corrosion and heat-resistant alloys' },
      { label: 'Plating', note: 'Protective and decorative finishes' },
    ],
  },
  {
    slug: 'copper-metal',
    symbol: 'Cu',
    name: 'Copper Metal',
    formula: 'Cu',
    mtpa: '~800',
    family: 'metal',
    col: 3,
    row: 2,
    index: '07',
    summary: 'Cathode copper recovered early in the circuit.',
    detail:
      'Copper comes in with anode foil and current collectors and is taken out ahead of the cobalt and nickel circuits by solvent extraction and electrowinning — the long-established SX-EW route.',
    stages: [
      FEED,
      PRE,
      LEACH,
      { icon: 'extract', label: 'Copper SX', note: 'Copper loaded and stripped ahead of other metals' },
      { icon: 'electro', label: 'Electrowinning', note: 'Plated as cathode copper' },
    ],
    uses: [
      { label: 'Battery foil', note: 'Anode current collectors' },
      { label: 'Wiring & busbars', note: 'Power distribution and EV harnesses' },
      { label: 'Electronics', note: 'Connectors and conductive components' },
    ],
  },
  {
    slug: 'emd',
    symbol: 'Mn',
    name: 'EMD',
    formula: 'Electrolytic MnO₂',
    mtpa: '~1,000',
    family: 'metal',
    col: 4,
    row: 2,
    index: '08',
    summary: 'Electrolytic manganese dioxide, made from recovered manganese units.',
    detail:
      'Manganese recovered from the leach circuit is refined to a manganese sulphate electrolyte and electrolysed to deposit manganese dioxide, which is then milled and neutralised to battery grade.',
    stages: [
      FEED,
      PRE,
      LEACH,
      { icon: 'purify', label: 'Mn electrolyte', note: 'Manganese sulphate solution prepared and purified' },
      { icon: 'electro', label: 'Electrolysis', note: 'MnO₂ deposited on anodes' },
      { icon: 'thermal', label: 'Finishing', note: 'Stripped, milled, neutralised and dried' },
    ],
    uses: [
      { label: 'Alkaline batteries', note: 'Primary cell cathode material' },
      { label: 'Zinc-carbon cells', note: 'Depolariser' },
      { label: 'Mn cathodes', note: 'Manganese-bearing lithium-ion chemistries' },
    ],
  },
  {
    slug: 'graphite',
    symbol: 'C',
    name: 'Graphite',
    formula: 'C',
    mtpa: '~2,700',
    family: 'carbon',
    col: 6,
    row: 1,
    index: '09',
    summary: 'The largest single stream by tonnage — anode carbon, recovered rather than mined.',
    detail:
      'Graphite is separated from the anode fraction during pre-treatment, then purified to remove binder, metals and residual electrolyte. Recovering it displaces both mined natural graphite and energy-intensive synthetic production.',
    stages: [
      FEED,
      { icon: 'mechanical', label: 'Anode separation', note: 'Graphite fraction recovered during pre-treatment' },
      { icon: 'leach', label: 'Acid wash', note: 'Residual metals and electrolyte removed' },
      { icon: 'thermal', label: 'Purification', note: 'Binder removed, carbon content raised' },
      { icon: 'dispatch', label: 'Classification', note: 'Sized, graded and packed' },
    ],
    uses: [
      { label: 'Anode material', note: 'Lithium-ion cell anodes' },
      { label: 'Refractories', note: 'Crucibles and furnace linings' },
      { label: 'Lubricants', note: 'Dry lubrication and industrial additives' },
    ],
  },
  {
    slug: 'nmp',
    symbol: 'NMP',
    name: 'NMP',
    formula: 'C₅H₉NO',
    mtpa: '~300',
    family: 'carbon',
    col: 6,
    row: 2,
    index: '10',
    summary: 'Electrode solvent recovered and redistilled rather than incinerated.',
    detail:
      'N-Methyl-2-pyrrolidone is the solvent electrode slurries are cast with. Recovering and redistilling it to specification is both an environmental and a cost argument — it is a high-value solvent that is otherwise destroyed.',
    stages: [
      FEED,
      { icon: 'mechanical', label: 'Solvent capture', note: 'Recovered from electrode and process streams' },
      { icon: 'purify', label: 'Pre-treatment', note: 'Solids and water removed' },
      { icon: 'distil', label: 'Distillation', note: 'Fractionated back to specification' },
      { icon: 'dispatch', label: 'Grading', note: 'Tested, drummed and dispatched' },
    ],
    uses: [
      { label: 'Electrode slurries', note: 'Cathode coating in cell manufacture' },
      { label: 'Coatings & resins', note: 'High-performance polymer processing' },
      { label: 'Industrial cleaning', note: 'Precision cleaning and stripping' },
    ],
  },
];

export const families = {
  salt: { label: 'Battery salts', hint: 'Crystallised sulphates and carbonates' },
  metal: { label: 'Refined metals', hint: 'Electrowon metal and electrolytic oxide' },
  carbon: { label: 'Carbon & solvents', hint: 'Anode carbon and recovered solvent' },
} as const;

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
