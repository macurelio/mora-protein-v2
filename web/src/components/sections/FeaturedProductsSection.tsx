import { motion } from 'framer-motion'
import ProductCarousel from '../carousels/ProductCarousel'
import { products } from '../../data/products'

const BASE = import.meta.env.BASE_URL

const CATEGORIES = ['Barras Proteicas', 'Bombones', 'Galletones'] as const

const CATEGORY_ICONS: Record<string, string> = {
  'Barras Proteicas': `${BASE}images/icons/barra-icono.png`,
  'Bombones':         `${BASE}images/bombones-ilustracion.png`,
  'Galletones':       `${BASE}images/icons/galleta-icono.png`,
}

const EASE = [0.25, 1, 0.5, 1] as const

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
}

const categoryTitleVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: EASE, delay: 0.05 },
  },
}

export default function FeaturedProductsSection() {
  return (
    <section id="productos" aria-label="Productos" className="py-20 sm:py-28 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={headerVariants}
        >
          <h2 className="font-heading font-black text-sand text-4xl sm:text-5xl leading-tight">
            Nuestros Productos
          </h2>
          <p className="mt-4 text-white/50 font-body text-base max-w-md mx-auto">
            Snacks proteicos artesanales. Sin azúcar, sin compromisos.
          </p>
        </motion.div>

        <div className="space-y-20">
          {CATEGORIES.map((category) => {
            const items = products.filter((p) => p.category === category)
            if (!items.length) return null
            return (
              <div key={category}>
                <motion.div
                  className="flex items-center gap-4 mb-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  variants={categoryTitleVariants}
                >
                  {CATEGORY_ICONS[category] && (
                    <img
                      src={CATEGORY_ICONS[category]}
                      alt=""
                      aria-hidden
                      className="w-14 h-14 object-contain drop-shadow-sm"
                    />
                  )}
                  <h3 className="font-heading font-black text-sand text-2xl sm:text-3xl uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </motion.div>

                <ProductCarousel products={items} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
