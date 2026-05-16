export interface Promo {
  id: string
  label: string
  title: string
  description: string
  originalPrice: number
  promoPrice: number
  savings: number
  badge: string
  image: string
  gradient: string
  tag: string
  items: string[]
}

const BASE = import.meta.env.BASE_URL

export const promos: Promo[] = [
  {
    id: 'promo-1',
    label: '🔥 Lo más vendido',
    title: 'Pack Barras x6',
    description: 'Las 3 barras más populares: Tiramisú, Chocolate Naranja y Cinnamon. Elige cobertura.',
    originalPrice: 11400,
    promoPrice: 9900,
    savings: 1500,
    badge: 'Ahorra $1.500',
    image: `${BASE}images/barras.jpg`,
    gradient: 'from-[#3d2211] to-[#1a0a04]',
    tag: 'Pack Favorito',
    items: ['2x Barra Tiramisú', '2x Barra Chocolate Naranja', '2x Barra Cinnamon'],
  },
  {
    id: 'promo-2',
    label: '⚡ Combo Galletones',
    title: 'Bolsa Galletones x8',
    description: 'Surtido de los 4 sabores: Chips de Chocolate, Almendra, Nuez y Cranberry.',
    originalPrice: 7200,
    promoPrice: 5900,
    savings: 1300,
    badge: 'Ahorra $1.300',
    image: `${BASE}images/galletones.png`,
    gradient: 'from-[#2a1a0a] to-[#111109]',
    tag: 'Surtido',
    items: ['2x Galletón Chips Chocolate', '2x Galletón Almendra', '2x Galletón Nuez', '2x Galletón Cranberry'],
  },
  {
    id: 'promo-3',
    label: '🍫 Edición especial',
    title: 'Box Mixto Proteico',
    description: '3 barras + 4 galletones + 2 bombones. El kit perfecto para toda la semana.',
    originalPrice: 15400,
    promoPrice: 12900,
    savings: 2500,
    badge: 'Ahorra $2.500',
    image: `${BASE}images/bombones.jpg`,
    gradient: 'from-[#1a2a12] to-[#0e1a0a]',
    tag: 'Más Completo',
    items: ['3x Barra Proteica (a elección)', '4x Galletón (surtido)', '2x Bombón Pistacho'],
  },
  {
    id: 'promo-4',
    label: '💪 Para deportistas',
    title: 'Pack Semanal x14',
    description: '2 barras diarias para tu semana. Alto en proteína, sin azúcar, ideal post-entrenamiento.',
    originalPrice: 26600,
    promoPrice: 21900,
    savings: 4700,
    badge: 'Ahorra $4.700',
    image: `${BASE}images/barras.jpg`,
    gradient: 'from-[#0d1a3d] to-[#0a0e1a]',
    tag: 'Mejor Valor',
    items: ['14x Barra Proteica (a elección de sabores)', 'Envío prioritario incluido'],
  },
]
