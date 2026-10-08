export interface Promo {
  id: string
  label: string
  title: string
  description: string
  originalPrice: number
  promoPrice: number
  savings: number
  badge: string
  emoji: string
  gradientFrom: string
  gradientTo: string
  tag: string
  items: string[]
}

export const promos: Promo[] = [
  {
    id: 'promo-1',
    label: '🥬 Lo más vendido',
    title: 'Pack Ensalada',
    description:
      'Todo lo que necesitas para ensaladas toda la semana: hojas frescas y vegetales del día.',
    originalPrice: 7060,
    promoPrice: 5990,
    savings: 1070,
    badge: 'Ahorra $1.070',
    emoji: '🥗',
    gradientFrom: '#14532d',
    gradientTo: '#052e16',
    tag: 'Fresco',
    items: ['1x Lechuga cultivar', '1x Rúcula', '1x Tomate (1 kg)', '1x Palta'],
  },
  {
    id: 'promo-2',
    label: '🛒 Para toda la semana',
    title: 'Canasta Semanal',
    description:
      'La compra básica del hogar en un solo pedido. Para 2 personas, llega listo a tu cocina.',
    originalPrice: 17490,
    promoPrice: 14990,
    savings: 2500,
    badge: 'Ahorra $2.500',
    emoji: '🧺',
    gradientFrom: '#3f3f2e',
    gradientTo: '#1c1c14',
    tag: 'Más Completo',
    items: [
      '2 kg Papas',
      '1 kg Cebolla',
      '1 kg Zanahoria',
      '1 kg Tomate',
      '1x Lechuga cultivar',
      '1 kg Betarraga',
      '1 kg Limón',
      '1x Rúcula',
      '2x Palta',
    ],
  },
  {
    id: 'promo-3',
    label: '🍊 Fruta de temporada',
    title: 'Box Frutas',
    description:
      'Selección de frutas maduras y listas para comer. Perfecto para el desayuno y la colación.',
    originalPrice: 11440,
    promoPrice: 9990,
    savings: 1450,
    badge: 'Ahorra $1.450',
    emoji: '🍓',
    gradientFrom: '#7c2d12',
    gradientTo: '#450a0a',
    tag: 'Dulce',
    items: ['2 kg Plátano', '1 kg Limón', '2x Palta', '1 kg Tomate'],
  },
  {
    id: 'promo-4',
    label: '🌱 Directo del campo',
    title: 'Caja de Temporada',
    description:
      'Lo mejor que llegó hoy del campo, armado por nosotros. Sorpresa fresca cada semana.',
    originalPrice: 15400,
    promoPrice: 12990,
    savings: 2410,
    badge: 'Ahorra $2.410',
    emoji: '🎁',
    gradientFrom: '#166534',
    gradientTo: '#022c22',
    tag: 'Surtido',
    items: ['Verduras de estación (5 – 7 ítems)', 'Hierbas frescas incluidas', 'Envío priorizado'],
  },
]
