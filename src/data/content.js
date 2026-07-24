/* Product copy. All of this is final and product-accurate — no invented
   metrics, logos, testimonials or pricing. */

export const FEATURES = [
  {
    icon: '↺',
    title: 'Automatic drift repair',
    body: 'Detects when a model returns fields your schema doesn’t expect and repairs them in place.',
  },
  {
    icon: '⇄',
    title: 'Type coercion',
    body: 'Safely casts strings, numbers and booleans to the types your contract declares.',
  },
  {
    icon: '≈',
    title: 'Fuzzy field-rename',
    body: 'Recovers near-miss keys like temp_c or temperatur by matching against your schema fields.',
  },
  {
    icon: '↳',
    title: 'Default-fill',
    body: 'Backfills missing optional fields from their declared defaults instead of raising.',
  },
  {
    icon: '∅',
    title: 'Zero core dependencies',
    body: 'The core ships with no runtime deps. Add the optional Pydantic adapter only if you use it.',
  },
  {
    icon: '≣',
    title: 'Local audit trail',
    body: 'Every repair is appended to ~/.stateguard/repairs.jsonl for inspectable, local history.',
  },
];

export const STRATEGIES = [
  {
    name: 'ExactAlias',
    desc: 'Maps declared field aliases — temp_celsius → temperature — straight from your alias table.',
  },
  {
    name: 'FuzzyRename',
    desc: 'Recovers near-miss keys by edit distance when no explicit alias exists.',
  },
  {
    name: 'TypeCoerce',
    desc: 'Casts compatible values ("80" → 80, "true" → True) to the type your contract declares.',
  },
  {
    name: 'DefaultFill',
    desc: 'Backfills missing optional fields from their declared defaults instead of raising.',
  },
];
