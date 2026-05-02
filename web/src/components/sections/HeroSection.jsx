import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ChevronDown } from 'lucide-react'

const WHATSAPP_NUMBER = '+56954099576'
const WHATSAPP_MSG = encodeURIComponent('¡Hola! Quiero hacer un pedido de Mora Protein 🍫💪')

const EASE = [0.25, 1, 0.5, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function HeroSection() {
  return (
    <section
      id="inicio"
      aria-label="Sección principal"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#181413' }}
    >
      {/* Logo en esquina superior izquierda */}
      <img
        src="/images/logo.png"
        alt="Mora Protein logo"
        className="absolute top-8 left-8 z-20 w-20 h-20 object-contain"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))' }}
      />
      {/* Fondo oscuro sólido, sin imagen de barras */}
      {/* Gradient overlay bottom opcional para contraste */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #1a1a1a, transparent)' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-32 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.span
            variants={item}
            className="inline-block mb-6 text-[11px] font-heading font-bold uppercase tracking-[0.25em] text-white/50 border border-white/15 px-4 py-1.5 rounded-full"
          >
            Snacks Saludables · Hecho a Mano
          </motion.span>

          {/* Main title */}
          <motion.h1
            variants={item}
            className="font-heading font-black leading-[0.92] text-white mb-2"
            style={{ fontSize: 'clamp(52px, 9vw, 120px)' }}
          >
            Snacks de proteína
          </motion.h1>
          <motion.h2
            variants={item}
            className="font-heading font-black leading-[0.92] mb-8"
            style={{
              fontSize: 'clamp(48px, 8.5vw, 112px)',
              color: '#D7CFC2',
            }}
          >
            100% naturales
          </motion.h2>

          {/* Tagline */}
          <motion.p
            variants={item}
            className="font-body text-white/55 text-lg sm:text-xl mb-10 tracking-wide"
          >
            Deliciosas.&nbsp;&nbsp;Nutritivas.&nbsp;&nbsp;Sin azúcar.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#productos"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-charcoal font-heading font-bold text-sm uppercase tracking-widest hover:bg-cream transition-colors duration-200"
            >
              Ver productos
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace('+','')}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#25D366] text-white font-heading font-bold text-sm uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-200"
            >
              <MessageCircle size={16} />
              Pedir ahora
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        aria-hidden
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  )
}
