const fallbackTone = {
  toneClass: 'bg-category-neutral-bg text-category-neutral-fg',
  spineClass: 'border-category-neutral-fg',
};

// Class names are written out in full so Tailwind can find them when it scans the source.
const toneByCategory = {
  Ficción: {
    toneClass: 'bg-category-ficcion-bg text-category-ficcion-fg',
    spineClass: 'border-category-ficcion-fg',
  },
  'Ciencia Ficción': {
    toneClass: 'bg-category-ciencia-ficcion-bg text-category-ciencia-ficcion-fg',
    spineClass: 'border-category-ciencia-ficcion-fg',
  },
  Fantasía: {
    toneClass: 'bg-category-fantasia-bg text-category-fantasia-fg',
    spineClass: 'border-category-fantasia-fg',
  },
  'Misterio y Suspenso': {
    toneClass: 'bg-category-misterio-suspenso-bg text-category-misterio-suspenso-fg',
    spineClass: 'border-category-misterio-suspenso-fg',
  },
  Romance: {
    toneClass: 'bg-category-romance-bg text-category-romance-fg',
    spineClass: 'border-category-romance-fg',
  },
  Historia: {
    toneClass: 'bg-category-historia-bg text-category-historia-fg',
    spineClass: 'border-category-historia-fg',
  },
  'Ciencia y Tecnología': {
    toneClass: 'bg-category-ciencia-tecnologia-bg text-category-ciencia-tecnologia-fg',
    spineClass: 'border-category-ciencia-tecnologia-fg',
  },
  'Infantil y Juvenil': {
    toneClass: 'bg-category-infantil-juvenil-bg text-category-infantil-juvenil-fg',
    spineClass: 'border-category-infantil-juvenil-fg',
  },
  Poesía: {
    toneClass: 'bg-category-poesia-bg text-category-poesia-fg',
    spineClass: 'border-category-poesia-fg',
  },
};

export function getCategoryTone(category) {
  const isKnown = Object.prototype.hasOwnProperty.call(toneByCategory, category);
  return isKnown ? toneByCategory[category] : fallbackTone;
}
