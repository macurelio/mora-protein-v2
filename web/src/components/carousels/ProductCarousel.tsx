import React, { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useAnimation } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../ui/ProductCard'
import type { ProductCarouselProps } from '../../types'

// ─── Animation variants ───────────────────────────────────────────────────────

const EASE_PREMIUM = [0.25, 1, 0.5, 1] as const

/** Stagger container: animates children in cascade */
const trackVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

/** Individual card: fade-up + scale entrance */
const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: EASE_PREMIUM },
  },
}

/**
 * Carousel B — Featured Products
 *
 * Responsive horizontal carousel with Framer Motion drag (swipe/click-drag),
 * snap-to-card physics, staggered entrance animations, and keyboard support.
 *
 * Visible cards: 1 (mobile) → 2 (sm) → 3 (lg) → 4 (xl)
 */
export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [offset, setOffset] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [cardWidth, setCardWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragX = useMotionValue(0)
  const controls = useAnimation()
  const GAP = 16

  // ── Responsive visible count ──────────────────────────────────────────────
  const updateLayout = useCallback(() => {
    const w = window.innerWidth
    const newVisible = w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1
    setVisibleCount(newVisible)

    if (containerRef.current) {
      const containerW = containerRef.current.offsetWidth
      setCardWidth((containerW - GAP * (newVisible - 1)) / newVisible)
    }
  }, [])

  useEffect(() => {
    updateLayout()
    const observer = new ResizeObserver(updateLayout)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [updateLayout])

  const maxOffset = Math.max(0, products.length - visibleCount)

  // Clamp offset when products or visibleCount changes
  useEffect(() => {
    setOffset((o) => Math.min(o, maxOffset))
  }, [maxOffset])

  // ── Derived position ──────────────────────────────────────────────────────
  const getTargetX = useCallback(
    (idx: number) => -idx * (cardWidth + GAP),
    [cardWidth],
  )

  const snapTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, maxOffset))
      setOffset(clamped)
      controls.start({ x: getTargetX(clamped), transition: { type: 'spring', stiffness: 280, damping: 30 } })
    },
    [maxOffset, controls, getTargetX],
  )

  const prev = useCallback(() => snapTo(offset - 1), [offset, snapTo])
  const next = useCallback(() => snapTo(offset + 1), [offset, snapTo])

  // ── Drag end: snap to nearest card ───────────────────────────────────────
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const threshold = cardWidth * 0.25
      const velocitySnap = Math.abs(info.velocity.x) > 400

      let newOffset = offset
      if (info.offset.x < -threshold || (velocitySnap && info.velocity.x < 0)) {
        newOffset = Math.min(offset + 1, maxOffset)
      } else if (info.offset.x > threshold || (velocitySnap && info.velocity.x > 0)) {
        newOffset = Math.max(offset - 1, 0)
      }
      snapTo(newOffset)
    },
    [offset, cardWidth, maxOffset, snapTo],
  )

  // Sync animation when offset changes externally (category filter)
  useEffect(() => {
    controls.start({ x: getTargetX(offset), transition: { type: 'spring', stiffness: 280, damping: 30 } })
  }, [offset, controls, getTargetX])

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }

  const canGoPrev = offset > 0
  const canGoNext = offset < maxOffset

  return (
    <div
      className="relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrusel de productos destacados"
    >
      {/* Overflow window */}
      <div ref={containerRef} className="overflow-hidden">
        {/* Draggable + staggered track */}
        <AnimatePresence mode="wait">
          <motion.div
            key={products.map((p) => p.id).join(',')}
            className="flex cursor-grab active:cursor-grabbing"
            style={{ gap: `${GAP}px`, x: dragX }}
            drag="x"
            dragConstraints={{ left: getTargetX(maxOffset) - 40, right: 40 }}
            dragElastic={0.08}
            dragMomentum={false}
            animate={controls}
            onDragEnd={handleDragEnd}
            variants={trackVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            aria-live="polite"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                className="flex-shrink-0"
                style={{ width: cardWidth || `calc(${100 / visibleCount}% - ${GAP * (visibleCount - 1) / visibleCount}px)` }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${products.length}: ${product.name}`}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation arrows ── */}
      <motion.button
        onClick={prev}
        disabled={!canGoPrev}
        whileHover={canGoPrev ? { scale: 1.08, backgroundColor: '#1A1A1A', color: '#ffffff' } : undefined}
        whileTap={canGoPrev ? { scale: 0.93 } : undefined}
        transition={{ duration: 0.18, ease: EASE_PREMIUM }}
        aria-label="Producto anterior"
        className={[
          'absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center',
          'rounded-full bg-white border border-cream-border shadow-md',
          canGoPrev ? 'text-charcoal' : 'text-cream-border cursor-not-allowed opacity-40',
        ].join(' ')}
      >
        <ChevronLeft size={18} />
      </motion.button>

      <motion.button
        onClick={next}
        disabled={!canGoNext}
        whileHover={canGoNext ? { scale: 1.08, backgroundColor: '#1A1A1A', color: '#ffffff' } : undefined}
        whileTap={canGoNext ? { scale: 0.93 } : undefined}
        transition={{ duration: 0.18, ease: EASE_PREMIUM }}
        aria-label="Siguiente producto"
        className={[
          'absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center',
          'rounded-full bg-white border border-cream-border shadow-md',
          canGoNext ? 'text-charcoal' : 'text-cream-border cursor-not-allowed opacity-40',
        ].join(' ')}
      >
        <ChevronRight size={18} />
      </motion.button>

      {/* ── Dot pagination ── */}
      <div
        className="flex justify-center items-center gap-2 mt-6"
        role="tablist"
        aria-label="Páginas del carrusel"
      >
        {Array.from({ length: maxOffset + 1 }).map((_, i) => (
          <motion.button
            key={i}
            role="tab"
            onClick={() => snapTo(i)}
            aria-label={`Ir a página ${i + 1}`}
            aria-selected={i === offset}
            animate={{
              width: i === offset ? 20 : 8,
              backgroundColor: i === offset ? '#1A1A1A' : '#E8E2D9',
            }}
            transition={{ duration: 0.28, ease: EASE_PREMIUM }}
            className="h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora"
          />
        ))}
      </div>
    </div>
  )
}
