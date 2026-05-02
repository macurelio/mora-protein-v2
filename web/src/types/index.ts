// ─── Product ─────────────────────────────────────────────────────────────────

export type ProductCategory = 'Barras Proteicas' | 'Galletones' | 'Bombones'

export interface Product {
  id: string
  name: string
  flavor: string
  category: ProductCategory
  description: string
  protein: string
  price: number
  badge: string | null
  coverageOptions: string[]
  image: string | null
  gradientFrom: string
  gradientTo: string
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

export interface Testimonial {
  id: number
  name: string
  handle: string
  initials: string
  color: string
  text: string
  rating: number
  product: string
}

// ─── Hero Slide ───────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp'

export interface HeroSlide {
  id: number
  badge: string
  title: string
  subtitle: string
  cta: string
  ctaHref: string
  ctaVariant: ButtonVariant
  bg: string
  accent: string
  subtitleColor: string
}

// ─── Carousel hook ────────────────────────────────────────────────────────────

export interface UseCarouselOptions {
  autoPlay?: boolean
  interval?: number
}

export interface UseCarouselReturn {
  current: number
  go: (index: number) => void
  prev: () => void
  next: () => void
  pause: () => void
  resume: () => void
}

// ─── ProductCard props ────────────────────────────────────────────────────────

export interface ProductCardProps {
  product: Product
}

// ─── ProductCarousel props ────────────────────────────────────────────────────

export interface ProductCarouselProps {
  products: Product[]
}
