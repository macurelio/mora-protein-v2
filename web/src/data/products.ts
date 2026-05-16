import type { Product } from '../types'

const BASE = import.meta.env.BASE_URL
const IMG_BARRAS = `${BASE}images/barras.jpg`
const IMG_GALLETONES = `${BASE}images/galletones.png`
const IMG_GALLETONES_STACK = `${BASE}images/galletones-stack.png`
const IMG_BOMBONES = `${BASE}images/bombones.jpg`

export const products: Product[] = [
  {
    id: 'b1',
    name: 'Barra Tiramisú',
    flavor: 'Tiramisú · Dulce de Leche',
    category: 'Barras Proteicas',
    description:
      'Relleno cremoso de tiramisú y dulce de leche, envuelto en cobertura de chocolate artesanal. 100% natural, sin azúcar añadida.',
    protein: '15g',
    price: 1900,
    badge: 'Más Popular',
    coverageOptions: ['Chocolate Negro', 'Chocolate Blanco'],
    image: IMG_BARRAS,
    gradientFrom: '#3d2211',
    gradientTo: '#6b3a1f',
  },
  {
    id: 'b2',
    name: 'Barra Chocolate Naranja',
    flavor: 'Chocolate · Naranja',
    category: 'Barras Proteicas',
    description:
      'Fusión irresistible de chocolate intenso y naranja natural. Sin gluten, sin azúcar, 15g de proteína por barra.',
    protein: '15g',
    price: 1900,
    badge: null,
    coverageOptions: ['Chocolate Negro', 'Chocolate Blanco'],
    image: IMG_BARRAS,
    gradientFrom: '#3a1a0a',
    gradientTo: '#c45c1a',
  },
  {
    id: 'b3',
    name: 'Barra Chocolate Cinnamon',
    flavor: 'Chocolate · Cinnamon',
    category: 'Barras Proteicas',
    description:
      'Canela caramelizada con cobertura de chocolate artesanal. Ingredientes 100% naturales, opción vegana disponible.',
    protein: '15g',
    price: 1900,
    badge: null,
    coverageOptions: ['Chocolate Negro', 'Chocolate Blanco'],
    image: IMG_BARRAS,
    gradientFrom: '#2e1a08',
    gradientTo: '#8b4513',
  },
  {
    id: 'g1',
    name: 'Galletón Chips de Chocolate',
    flavor: 'Chips de Chocolate',
    category: 'Galletones',
    description:
      'Avena integral, harina de avena y proteína vegana. Endulzado con alulosa, fuente de fibra. Crocante y delicioso.',
    protein: '10g',
    price: 900,
    badge: 'Más Popular',
    coverageOptions: [],
    image: IMG_GALLETONES_STACK,
    gradientFrom: '#1e1008',
    gradientTo: '#4a2c14',
  },
  {
    id: 'g2',
    name: 'Galletón Almendra',
    flavor: 'Almendra',
    category: 'Galletones',
    description:
      'Almendras enteras sobre masa proteica de avena integral. Sin azúcar, fuente de fibra, proteína vegana.',
    protein: '9g',
    price: 900,
    badge: null,
    coverageOptions: [],
    image: IMG_GALLETONES,
    gradientFrom: '#2a1a0a',
    gradientTo: '#7d5c30',
  },
  {
    id: 'g3',
    name: 'Galletón Nuez',
    flavor: 'Nuez',
    category: 'Galletones',
    description:
      'Nueces en masa artesanal de avena. Bajo en azúcar, alto en proteína y fibra. Un snack que enamora.',
    protein: '10g',
    price: 900,
    badge: null,
    coverageOptions: [],
    image: IMG_GALLETONES,
    gradientFrom: '#1e1308',
    gradientTo: '#6b4c22',
  },
  {
    id: 'g4',
    name: 'Galletón Cranberry',
    flavor: 'Cranberry',
    category: 'Galletones',
    description:
      'Cranberries naturales con proteína de alta calidad. Dulce, ácido y fit. Endulzado solo con alulosa.',
    protein: '10g',
    price: 900,
    badge: 'Edición Especial',
    coverageOptions: [],
    image: IMG_GALLETONES,
    gradientFrom: '#3d0d18',
    gradientTo: '#a0263d',
  },
  {
    id: 'c1',
    name: 'Bombón Coco',
    flavor: 'Coco',
    category: 'Bombones',
    description:
      'Coco rallado con base de mantequilla de maní y dátil. Sin gluten, 5 ingredientes, bañado en chocolate negro 72%.',
    protein: '12g',
    price: 1300,
    badge: null,
    coverageOptions: ['Chocolate Negro 72%', 'Chocolate Blanco 35%'],
    image: IMG_BOMBONES,
    gradientFrom: '#1a0e0a',
    gradientTo: '#3d2511',
  },
  {
    id: 'c2',
    name: 'Bombón Pistacho',
    flavor: 'Pistacho',
    category: 'Bombones',
    description:
      'Pistacho tostado con base de mantequilla de maní y dátil. Sin gluten, 5 ingredientes naturales.',
    protein: '12g',
    price: 1300,
    badge: 'Nuevo',
    coverageOptions: ['Chocolate Negro 72%', 'Chocolate Blanco 35%'],
    image: IMG_BOMBONES,
    gradientFrom: '#1a2a12',
    gradientTo: '#3d6b22',
  },
  {
    id: 'c3',
    name: 'Bombón Almendra',
    flavor: 'Almendra',
    category: 'Bombones',
    description:
      'Almendra natural con base de mantequilla de maní y dátil. Sin gluten, 5 ingredientes, puro sabor artesanal.',
    protein: '12g',
    price: 1300,
    badge: null,
    coverageOptions: ['Chocolate Negro 72%', 'Chocolate Blanco 35%'],
    image: IMG_BOMBONES,
    gradientFrom: '#1e1508',
    gradientTo: '#b89a6e',
  },
]

export const featuredProducts: Product[] = products.filter((p) =>
  ['b1', 'b2', 'g1', 'g4', 'c2'].includes(p.id),
)
