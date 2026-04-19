export const VETEMENTS_CATEGORIES = [
  { key: 'bodies-ml',    label: 'Bodies ML',    emoji: '🧦', groupe: 'bodies',       manches: 'manches longues' },
  { key: 'bodies-mc',    label: 'Bodies MC',    emoji: '🧦', groupe: 'bodies',       manches: 'manches courtes' },
  { key: 'hauts-ml',     label: 'Hauts ML',     emoji: '👕', groupe: 'hauts',        manches: 'manches longues' },
  { key: 'hauts-mc',     label: 'Hauts MC',     emoji: '👕', groupe: 'hauts',        manches: 'manches courtes' },
  { key: 'bas',          label: 'Bas',          emoji: '👖', groupe: 'bas',          manches: null },
  { key: 'pyjamas',      label: 'Pyjamas',      emoji: '🌙', groupe: 'pyjamas',      manches: null },
  { key: 'ensembles',    label: 'Ensembles',    emoji: '✨', groupe: 'ensembles',    manches: null },
  { key: 'blousons',     label: 'Blousons',     emoji: '🧥', groupe: 'blousons',     manches: null },
  { key: 'chaussettes',  label: 'Chaussettes',  emoji: '🧦', groupe: 'chaussettes',  manches: null },
  { key: 'chaussons',    label: 'Chaussons',    emoji: '👟', groupe: 'chaussons',    manches: null },
  { key: 'gants',        label: 'Gants',        emoji: '🧤', groupe: 'gants',        manches: null },
  { key: 'bonnets',      label: 'Bonnets',      emoji: '🧢', groupe: 'bonnets',      manches: null },
]

export const AUTRES_CATEGORIES = [
  { key: 'jouets',       label: 'jouets',    emoji: '🧸' },
  { key: 'puériculture', label: 'puéri.',    emoji: '🍼' },
  { key: 'bain',         label: 'bain',      emoji: '🛁' },
  { key: 'chambre',      label: 'chambre',   emoji: '🛏' },
  { key: 'accessoires',  label: 'access.',   emoji: '🎒' },
  { key: 'autre',        label: 'autre',     emoji: '📦' },
]

export const CATEGORIES = [...VETEMENTS_CATEGORIES, ...AUTRES_CATEGORIES]

export const GROUPES_VETEMENTS = [
  'bodies', 'hauts', 'bas', 'pyjamas', 'ensembles',
  'blousons', 'chaussettes', 'chaussons', 'gants', 'bonnets',
]
