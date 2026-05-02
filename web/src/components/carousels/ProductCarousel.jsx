import React, { useRef, useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../ui/ProductCard'

/**
 * Carousel B — Featured Products
 *
 * Responsive horizontal sliding carousel for product cards.
 * Visible cards: 1 (mobile) → 2 (sm) → 3 (lg) → 4 (xl)
 * Supports touch-swipe and keyboard navigation.
 */
export default function ProductCarousel({ products }) {
  const [offset, setOffset] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const containerRef = useRef(null)
  const touchStartX = useRef(0)

  // Determine how many cards fit in the current viewport
  const updateVisible = useCallback(() => {
    const w = window.innerWidth
    if (w >= 1280) setVisibleCount(4)
    else if (w >= 1024) setVisibleCount(3)
    else if (w >= 640) setVisibleCount(2)
    else setVisibleCount(1)
  }, [])

  useEffect(() => {
    updateVisible()
    window.addEventListener('resize', updateVisible)
    return () => window.removeEventListener('resize', updateVisible)
  }, [updateVisible])

  const maxOffset = Math.max(0, products.length - visibleCount)
  const canGoPrev = offset > 0
  const canGoNext = offset < maxOffset

  const prev = () => setOffset((o) => Math.max(0, o - 1))
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1))

  // Clamp offset when visibleCount changes
  useEffect(() => {
    setOffset((o) => Math.min(o, Math.max(0, products.length - visibleCount)))
  }, [visibleCount, products.length])

  // Touch swipe
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  // Keyboard arrow support when carousel is focused
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }

  // Width of a single card = (containerWidth - gaps) / visibleCount
  // We express this in % relative to the full container so CSS handles it.
  const cardWidthPercent = 100 / visibleCount
  const gapPx = 16
  const translateXValue = `calc(-${offset * cardWidthPercent}% - ${offset * gapPx}px)`

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de productos destacados"
    >
      {/* Overflow window */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        aria-live="polite"
      >
        {/* Track */}
        <div
          className="carousel-track flex"
          style={{
            gap: `${gapPx}px`,
            transform: `translateX(${translateXValue})`,
          }}
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{ width: `calc(${cardWidthPercent}% - ${gapPx * (visibleCount - 1) / visibleCount}px)` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${products.length}`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        disabled={!canGoPrev}
        aria-label="Producto anterior"
        className={[
          'absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center',
          'rounded-full bg-white border border-cream-border shadow-md transition-all duration-200',
          canGoPrev
            ? 'text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal'
            : 'text-cream-border cursor-not-allowed opacity-50',
        ].join(' ')}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        disabled={!canGoNext}
        aria-label="Siguiente producto"
        className={[
          'absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center',
          'rounded-full bg-white border border-cream-border shadow-md transition-all duration-200',
          canGoNext
            ? 'text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal'
            : 'text-cream-border cursor-not-allowed opacity-50',
        ].join(' ')}
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {Array.from({ length: maxOffset + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setOffset(i)}
            aria-label={`Ir a página ${i + 1}`}
            aria-current={i === offset ? 'true' : undefined}
            className={[
              'rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora',
              i === offset
                ? 'w-5 h-2 bg-charcoal'
                : 'w-2 h-2 bg-cream-border hover:bg-muted',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
