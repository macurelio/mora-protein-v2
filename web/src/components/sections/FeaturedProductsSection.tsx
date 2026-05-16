import { motion } from 'framer-motion'
import ProductCarousel from '../carousels/ProductCarousel'
import { products } from '../../data/products'

const CATEGORIES = ['Barras Proteicas', 'Bombones', 'Galletones'] as const

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
    <section id="productos" aria-label="Productos" className="py-20 sm:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={headerVariants}
        >
          <h2 className="font-heading font-black text-charcoal text-4xl sm:text-5xl leading-tight">
            Nuestros Productos
          </h2>
          <p className="mt-4 text-muted font-body text-base max-w-md mx-auto">
            Snacks proteicos artesanales. Sin azúcar, sin compromisos.
          </p>
        </motion.div>

        <div className="space-y-20">
          {CATEGORIES.map((category, catIdx) => {
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
                  <span className="text-muted font-heading font-black text-sm tracking-widest">
                    {String(catIdx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-heading font-black text-charcoal text-2xl sm:text-3xl uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-cream-border to-transparent" />
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
