import React from 'react'
import HeroCarousel from '../carousels/HeroCarousel'

/**
 * HeroSection — wraps Carousel A (Hero/Promotions).
 * The carousel itself fills the full section height.
 */
export default function HeroSection() {
  return (
    <section
      id="inicio"
      aria-label="Sección principal"
      className="w-full"
    >
      <HeroCarousel />
    </section>
  )
}
