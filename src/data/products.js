import { PRODUCT_CATEGORIES } from './categories';

export const products = [
  {
    id: 'g1',
    name: 'Galletón Chips de Chocolate',
    flavor: 'Chips de Chocolate',
    description: '10g Proteína • Sin azúcar',
    price: 900,
    image: require('../../assets/imagen-horizontal-de.png'),
    category: PRODUCT_CATEGORIES.COOKIES
  },
  {
    id: 'g2',
    name: 'Galletón Almendra',
    flavor: 'Almendra',
    description: '9g Proteína • Sin azúcar',
    price: 950,
    image: require('../../assets/imagen-horizontal-de.png'),
    category: PRODUCT_CATEGORIES.COOKIES
  },
  {
    id: 'g3',
    name: 'Galletón Nuez',
    flavor: 'Nuez',
    description: '10g Proteína • Sin azúcar',
    price: 950,
    image: require('../../assets/imagen-horizontal-de.png'),
    category: PRODUCT_CATEGORIES.COOKIES
  },
  {
    id: 'g4',
    name: 'Galletón Cranberry',
    flavor: 'Cranberry',
    description: '10g Proteína • Sin azúcar',
    price: 980,
    image: require('../../assets/imagen-horizontal-de.png'),
    category: PRODUCT_CATEGORIES.COOKIES
  },
  {
    id: 'b1',
    name: 'Barra Tiramisú · Dulce de Leche',
    flavor: 'Tiramisú · Dulce de Leche',
    description: '15g Proteína • Sin azúcar',
    price: 1900,
    image: require('../../assets/barras-ilustacion.png'),
    category: PRODUCT_CATEGORIES.BARS,
    coverageOptions: ['Chocolate Negro', 'Chocolate Blanco']
  },
  {
    id: 'b4',
    name: 'Barra Coco',
    flavor: 'Coco',
    description: '15g Proteína • Sin azúcar',
    price: 1900,
    image: require('../../assets/barras-ilustacion.png'),
    category: PRODUCT_CATEGORIES.BARS,
    coverageOptions: ['Chocolate Negro', 'Chocolate Blanco']
  },
  {
    id: 'b2',
    name: 'Barra Chocolate Naranja',
    flavor: 'Chocolate Naranja',
    description: '15g Proteína • Sin azúcar',
    price: 1900,
    image: require('../../assets/barras-ilustacion.png'),
    category: PRODUCT_CATEGORIES.BARS,
    coverageOptions: ['Chocolate Negro', 'Chocolate Blanco']
  },
  {
    id: 'b3',
    name: 'Barra Chocolate Cinnamon',
    flavor: 'Chocolate Cinnamon',
    description: '15g Proteína • Sin azúcar',
    price: 1900,
    image: require('../../assets/barras-ilustacion.png'),
    category: PRODUCT_CATEGORIES.BARS,
    coverageOptions: ['Chocolate Negro', 'Chocolate Blanco']
  },
  {
    id: 'c1',
    name: 'Bombón Coco y Cacao',
    flavor: 'Coco y Cacao',
    description: '12g Proteína • Sin azúcar',
    price: 1300,
    image: require('../../assets/bombones-ilustracion.png'),
    category: PRODUCT_CATEGORIES.BONBONS
  },
  {
    id: 'c2',
    name: 'Bombón Pistacho con Chocolate Blanco',
    flavor: 'Pistacho con Chocolate Blanco',
    description: '12g Proteína • Sin azúcar',
    price: 1350,
    image: require('../../assets/bombones-ilustracion.png'),
    category: PRODUCT_CATEGORIES.BONBONS
  },
  {
    id: 'c3',
    name: 'Bombón Almendra con Chocolate Blanco',
    flavor: 'Almendra con Chocolate Blanco',
    description: '12g Proteína • Sin azúcar',
    price: 1350,
    image: require('../../assets/bombones-ilustracion.png'),
    category: PRODUCT_CATEGORIES.BONBONS
  }
];
