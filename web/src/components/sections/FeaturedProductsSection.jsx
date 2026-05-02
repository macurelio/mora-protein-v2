import React, { useState } from 'react'
import ProductCarousel from '../carousels/ProductCarousel'
import { products } from '../../data/products'

const CATEGORY_LABELS = {
  All: 'Todos',
  'Barras Proteicas': 'Barras',
  Galletones: 'Galletones',
  Bombones: 'Bombones',
}

const CATEGORIES = ['All', 'Barras Proteicas', 'Galletones', 'Bombones']

/**
 * FeaturedProductsSection — showcases products using Carousel B.
 * Includes a category filter bar that hot-swaps the displayed product list.
 */
export default function FeaturedProductsSection() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <section
      id="productos"
      aria-label="Productos destacados"
      className="py-16 sm:py-20 bg-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-cream-warm text-cocoa text-xs font-heading font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
            Catálogo
          </span>
          <h2 className="font-heading font-black text-charcoal text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Nuestros Productos
          </h2>
          <p className="mt-3 text-muted font-body text-base max-w-xl mx-auto">
            Snacks proteicos artesanales para cada momento del día. Sin azúcar, sin compromisos.
          </p>
        </div>

        {/* Category filter tabs */}
        <div
          className="flex justify-center flex-wrap gap-2 mb-10"
          role="tablist"
          aria-label="Filtrar por categoría"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                'px-5 py-2 rounded-full text-sm font-heading font-bold border transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora focus-visible:ring-offset-2',
                activeCategory === cat
                  ? 'bg-charcoal text-white border-charcoal shadow-sm'
                  : 'bg-white text-charcoal border-cream-border hover:border-charcoal',
              ].join(' ')}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Carousel B */}
        <div className="px-6">
          {filtered.length > 0 ? (
            <ProductCarousel products={filtered} />
          ) : (
            <p className="text-center text-muted font-body py-12">
              No hay productos en esta categoría.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
