import React, { useCallback, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCarousel } from '../../hooks/useCarousel'
import Button from '../ui/Button'
import type { HeroSlide } from '../../types'

const slides: HeroSlide[] = [
  {
    id: 1,
    badge: 'Artesanal & Premium',
    title: 'Proteína que\nsabe increíble.',
    subtitle:
      'Barras y galletones proteicos elaborados con ingredientes naturales. Sin azúcar, sin compromisos.',
    cta: 'Descubrir Productos',
    ctaHref: '#productos',
    ctaVariant: 'secondary',
    bg: 'linear-gradient(135deg, #1a0e0a 0%, #2d1a0e 50%, #3d2017 100%)',
    accent: '#D7CFC2',
    subtitleColor: '#a09385',
  },
  {
    id: 2,
    badge: 'Sin Azúcar · 15g Proteína',
    title: 'El snack que tu\ncuerpo merece.',
    subtitle:
      'Cobertura de chocolate artesanal en negro o blanco. Irresistibles desde el primer mordisco.',
    cta: 'Ver Barras Proteicas',
    ctaHref: '#productos',
    ctaVariant: 'primary',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2d1a0e 100%)',
    accent: '#f5c3e4',
    subtitleColor: '#a09385',
  },
  {
    id: 3,
    badge: 'Fit · Delicioso · Artesanal',
    title: 'Galletones que\nno te arrepentirás.',
    subtitle:
      'Chips de Chocolate, Almendra, Nuez, Cranberry. Cuatro sabores únicos para elevar tu día.',
    cta: 'Pedir por WhatsApp',
    ctaHref: '#contacto',
    ctaVariant: 'whatsapp',
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #2e1f14 60%, #4A3C2F 100%)',
    accent: '#F9F8F6',
    subtitleColor: '#a09385',
  },
]

// ─── Animation variants ───────────────────────────────────────────────────────

const EASE_PREMIUM = [0.25, 1, 0.5, 1] as const

/** Direction-aware slide: enters from right (dir>0) or left (dir<0) */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 260, damping: 32 },
      opacity: { duration: 0.25 },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      x: { type: 'spring' as const, stiffness: 260, damping: 32 },
      opacity: { duration: 0.2 },
    },
  }),
}

/** Stagger container for badge → title → subtitle → CTA */
const contentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.18 },
  },
  exit: {
    transition: { staggerChildren: 0.06, staggerDirection: -1 as const },
  },
}

/** Individual element: fade-up in, fade-up-out on exit */
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE_PREMIUM },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1] as const },
  },
}

// ─── Grain SVG (memoised string) ──────────────────────────────────────────────
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"

/**
 * Carousel A — Hero / Promotions
 * Full-width, auto-playing banner with Framer Motion parallax + staggered text.
 */
export default function HeroCarousel() {
  const dirRef = useRef(1)
  const prevIndexRef = useRef(0)

  const { current, go, prev, next, pause, resume } = useCarousel(slides.length, {
    autoPlay: true,
    interval: 5000,
  })

  // ── Mouse parallax ──────────────────────────────────────────────────────────
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 70, damping: 22 })
  const springY = useSpring(rawY, { stiffness: 70, damping: 22 })

  // Watermark moves opposite to cursor (parallax depth)
  const watermarkX = useTransform(springX, [-700, 700], [24, -24])
  const watermarkY = useTransform(springY, [-450, 450], [12, -12])
  // Content shifts very subtly WITH cursor
  const contentX = useTransform(springX, [-700, 700], [-7, 7])
  const contentY = useTransform(springY, [-450, 450], [-3.5, 3.5])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      rawX.set(e.clientX - rect.left - rect.width / 2)
      rawY.set(e.clientY - rect.top - rect.height / 2)
    },
    [rawX, rawY],
  )

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  // ── Direction tracking ──────────────────────────────────────────────────────
  const navigateWithDir = useCallback(
    (newIndex: number) => {
      dirRef.current = newIndex > prevIndexRef.current ? 1 : -1
      prevIndexRef.current = newIndex
      go(newIndex)
    },
    [go],
  )

  const handlePrev = useCallback(() => {
    const newIndex = ((current - 1) + slides.length) % slides.length
    dirRef.current = -1
    prevIndexRef.current = newIndex
    prev()
  }, [current, prev])

  const handleNext = useCallback(() => {
    const newIndex = (current + 1) % slides.length
    dirRef.current = 1
    prevIndexRef.current = newIndex
    next()
  }, [current, next])

  // ── Touch swipe ─────────────────────────────────────────────────────────────
  const touchStartX = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev()
  }

  const slide = slides[current]

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ height: 'min(90vh, 680px)' }}
      onMouseEnter={pause}
      onMouseLeave={() => { resume(); handleMouseLeave(); }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Promociones destacadas"
    >
      {/* ── Animated slide background ── */}
      <AnimatePresence initial={false} custom={dirRef.current}>
        <motion.div
          key={current}
          custom={dirRef.current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          style={{ background: slide.bg }}
          aria-roledescription="slide"
          aria-label={`Diapositiva ${current + 1} de ${slides.length}`}
        >
          {/* Grain texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{ backgroundImage: GRAIN_URL }}
            aria-hidden
          />

          {/* Parallax watermark */}
          <motion.div
            className="absolute right-[-2%] bottom-[-4%] font-heading font-black leading-none pointer-events-none opacity-[0.04] text-[clamp(80px,18vw,220px)]"
            style={{ color: slide.accent, x: watermarkX, y: watermarkY }}
            aria-hidden
          >
            Mora
          </motion.div>

          {/* Staggered content */}
          <motion.div
            className="relative z-10 max-w-3xl w-full text-left px-6 sm:px-16 lg:px-28 h-full flex flex-col justify-center"
            style={{ x: contentX, y: contentY }}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Badge */}
            <motion.span
              variants={itemVariants}
              className="inline-block w-fit mb-4 text-xs font-heading font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
              style={{ color: slide.accent, borderColor: `${slide.accent}40` }}
            >
              {slide.badge}
            </motion.span>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="font-heading font-black text-white text-4xl sm:text-6xl lg:text-7xl leading-none mb-4 whitespace-pre-line"
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="font-body text-base sm:text-lg max-w-xl mb-8 leading-relaxed"
              style={{ color: slide.subtitleColor }}
            >
              {slide.subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <Button
                as="a"
                href={slide.ctaHref}
                variant={slide.ctaVariant}
                size="lg"
              >
                {slide.cta}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── Prev / Next arrows ── */}
      <motion.button
        onClick={handlePrev}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.22)' }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18, ease: EASE_PREMIUM }}
        aria-label="Diapositiva anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20"
      >
        <ChevronLeft size={20} />
      </motion.button>

      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.22)' }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.18, ease: EASE_PREMIUM }}
        aria-label="Siguiente diapositiva"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20"
      >
        <ChevronRight size={20} />
      </motion.button>

      {/* ── Dot indicators ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
        role="tablist"
        aria-label="Diapositivas"
      >
        {slides.map((_, i) => (
          <motion.button
            key={i}
            role="tab"
            onClick={() => navigateWithDir(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            aria-selected={i === current}
            animate={{
              width: i === current ? 24 : 8,
              backgroundColor: i === current ? '#ffffff' : 'rgba(255,255,255,0.38)',
            }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            className="h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          />
        ))}
      </div>

      {/* ── Progress bar (Framer Motion) ── */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10 z-20">
        <motion.div
          key={current}
          className="h-full bg-white/50 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
