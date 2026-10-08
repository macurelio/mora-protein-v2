export const PRODUCT_CATEGORIES = {
  GREENS: 'Hojas Verdes',
  ROOTS: 'Raíces y Tubérculos',
  FRUITS: 'Frutas',
  HERBS: 'Hierbas y Aromáticas',
};

export const PRODUCT_CATEGORY_LIST = [
  {
    name: PRODUCT_CATEGORIES.GREENS,
    emoji: '🥬',
    blurb: 'Hojas frescas del día para ensaladas, cazuelas y jugos.',
  },
  {
    name: PRODUCT_CATEGORIES.ROOTS,
    emoji: '🥕',
    blurb: 'La base de la cocina chilena, directo desde el campo.',
  },
  {
    name: PRODUCT_CATEGORIES.FRUITS,
    emoji: '🍅',
    blurb: 'Fruta de temporada, madura y lista para comer.',
  },
  {
    name: PRODUCT_CATEGORIES.HERBS,
    emoji: '🌿',
    blurb: 'Aromáticas frescas para dar sabor a cada plato.',
  },
];

export const CATEGORY_EMOJI = PRODUCT_CATEGORY_LIST.reduce((acc, c) => {
  acc[c.name] = c.emoji;
  return acc;
}, {});
