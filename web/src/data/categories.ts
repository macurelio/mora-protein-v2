import type { CategoryMeta } from '../types'

export const CATEGORIES: CategoryMeta[] = [
  {
    name: 'Hojas Verdes',
    emoji: '🥬',
    blurb: 'Hojas frescas del día para ensaladas, cazuelas y jugos.',
  },
  {
    name: 'Raíces y Tubérculos',
    emoji: '🥕',
    blurb: 'La base de la cocina chilena, directo desde el campo.',
  },
  {
    name: 'Frutas',
    emoji: '🍅',
    blurb: 'Fruta de temporada, madura y lista para comer.',
  },
  {
    name: 'Hierbas y Aromáticas',
    emoji: '🌿',
    blurb: 'Aromáticas frescas para dar sabor a cada plato.',
  },
]

export const CATEGORY_EMOJI: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.name, c.emoji]),
)
