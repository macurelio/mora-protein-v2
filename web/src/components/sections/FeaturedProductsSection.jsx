import React from 'react'
import { motion } from 'framer-motion'
import ProductCard, { cardVariants } from '../ui/ProductCard'
import { products } from '../../data/products'

const CATEGORIES = ['Barras Proteicas', 'Bombones', 'Galletones']

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function FeaturedProductsSection() {
  return (
    <section
      id="productos"
      aria-label="Productos"
      className="py-20 sm:py-28 bg-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-black text-charcoal text-4xl sm:text-5xl leading-tight">
            Nuestros Productos
          </h2>
          <p className="mt-4 text-muted font-body text-base max-w-md mx-auto">
            Snacks proteicos artesanales. Sin azúcar, sin compromisos.
          </p>
        </div>

        {/* One section per category */}
        <div className="space-y-20">
          {CATEGORIES.map((category) => {
            const items = products.filter((p) => p.category === category)
            if (!items.length) return null
            return (
              <div key={category}>
                {/* Category heading */}
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="font-heading font-black text-charcoal text-2xl sm:text-3xl uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-cream-border" />
                </div>

                {/* Grid */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  {items.map((product) => (
                    <motion.div key={product.id} variants={cardVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

