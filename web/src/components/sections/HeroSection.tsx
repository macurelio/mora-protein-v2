import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import HeroCarousel from '../carousels/HeroCarousel'

export default function HeroSection() {
  return (
    <section id="inicio" aria-label="Sección principal" className="relative">
      <HeroCarousel />
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 z-30"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        aria-hidden
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}
