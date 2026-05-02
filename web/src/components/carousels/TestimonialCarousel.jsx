import React, { useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useCarousel } from '../../hooks/useCarousel'
import { testimonials } from '../../data/testimonials'

/**
 * Carousel C — Social Proof / Testimonials
 *
 * Minimal fade-transition slider showing one testimonial at a time.
 * Auto-advances every 6 seconds; pauses on hover.
 */
export default function TestimonialCarousel() {
  const { current, go, prev, next, pause, resume } = useCarousel(
    testimonials.length,
    { autoPlay: true, interval: 6000 },
  )

  const touchStartX = useRef(0)
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  const t = testimonials[current]

  return (
    <div
      className="relative max-w-2xl mx-auto px-4"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Testimonios de clientes"
    >
      {/* Quote card — key prop triggers re-mount → fade-enter animation */}
      <div
        key={current}
        className="fade-enter bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-cream-border relative"
      >
        {/* Decorative quote icon */}
        <Quote
          size={40}
          className="absolute top-6 right-6 text-cream-border fill-cream-border"
          aria-hidden
        />

        {/* Stars */}
        <div className="flex gap-1 mb-5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} size={16} className="fill-[#F59E0B] text-[#F59E0B]" />
          ))}
        </div>

        {/* Text */}
        <blockquote className="font-body text-base sm:text-lg text-charcoal leading-relaxed mb-6">
          "{t.text}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-heading font-black text-sm flex-shrink-0"
            style={{ backgroundColor: t.color }}
            aria-hidden
          >
            {t.initials}
          </div>
          <div>
            <p className="font-heading font-bold text-charcoal text-sm">{t.name}</p>
            <p className="font-body text-xs text-muted">{t.handle}</p>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Testimonio anterior"
        className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-cream-border shadow-sm text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente testimonio"
        className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-cream-border shadow-sm text-charcoal hover:bg-charcoal hover:text-white transition-all duration-200"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Ir al testimonio ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
            className={[
              'rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora',
              i === current
                ? 'w-5 h-2 bg-mora'
                : 'w-2 h-2 bg-cream-border hover:bg-muted',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
