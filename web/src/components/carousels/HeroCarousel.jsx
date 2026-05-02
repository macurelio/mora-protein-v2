import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCarousel } from '../../hooks/useCarousel'
import Button from '../ui/Button'

const slides = [
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

/**
 * Carousel A — Hero / Promotions
 * Full-width, auto-playing banner carousel with CTAs.
 */
export default function HeroCarousel() {
  const { current, go, prev, next, pause, resume } = useCarousel(slides.length, {
    autoPlay: true,
    interval: 5000,
  })

  // Touch-swipe support
  const touchStartX = useRef(0)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ height: 'min(90vh, 680px)' }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Promociones destacadas"
    >
      {/* Slide track */}
      <div
        className="carousel-track flex h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="relative flex-shrink-0 w-full h-full flex items-center justify-center px-6 sm:px-16 lg:px-28"
            style={{ background: slide.bg }}
            role="group"
            aria-roledescription="slide"
            aria-label={`Diapositiva ${i + 1} de ${slides.length}`}
            aria-hidden={i !== current}
          >
            {/* Decorative grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-3xl w-full text-left">
              <span
                className="inline-block mb-4 text-xs font-heading font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
                style={{ color: slide.accent, borderColor: `${slide.accent}40` }}
              >
                {slide.badge}
              </span>

              <h1
                className="font-heading font-black text-white text-4xl sm:text-6xl lg:text-7xl leading-none mb-4 whitespace-pre-line"
              >
                {slide.title}
              </h1>

              <p
                className="font-body text-base sm:text-lg max-w-xl mb-8 leading-relaxed"
                style={{ color: slide.subtitleColor }}
              >
                {slide.subtitle}
              </p>

              <Button
                as="a"
                href={slide.ctaHref}
                variant={slide.ctaVariant}
                size="lg"
              >
                {slide.cta}
              </Button>
            </div>

            {/* Subtle brand watermark */}
            <div
              className="absolute right-[-2%] bottom-[-4%] font-heading font-black text-[clamp(80px,18vw,220px)] leading-none pointer-events-none opacity-[0.035]"
              style={{ color: slide.accent }}
              aria-hidden
            >
              Mora
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Diapositiva anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-200 border border-white/20"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente diapositiva"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all duration-200 border border-white/20"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
            className={[
              'rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/10 z-20">
        <div
          key={current}
          className="h-full bg-white/50"
          style={{
            width: '100%',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            animation: 'progressBar 5s linear forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes progressBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}
