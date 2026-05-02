import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '56954099576'
const WHATSAPP_MSG = encodeURIComponent(
  '¡Hola! Quiero distribuir Mora Protein en mi local 🍫',
)

export default function B2BSection() {
  return (
    <section
      id="trabaja"
      aria-label="Trabaja con nosotros"
      className="py-20 sm:py-28 bg-charcoal"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
          >
            <span className="inline-block text-[11px] font-heading font-bold uppercase tracking-[0.25em] text-white/40 border border-white/10 px-4 py-1.5 rounded-full mb-6">
              Para locales y gimnasios
            </span>

            <h2 className="font-heading font-black text-white text-4xl sm:text-5xl leading-tight mb-4">
              Trabaja con{' '}
              <span style={{ color: '#D7CFC2' }}>Nosotros</span>
            </h2>

            <p className="text-white/50 font-body text-base sm:text-lg leading-relaxed mb-8">
              ¿Quieres distribuir Mora Protein en tu local o gimnasio?{' '}
              <span className="text-white/80">Conversemos.</span>
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#25D366] text-white font-heading font-bold text-sm uppercase tracking-widest hover:bg-[#1da851] transition-colors duration-200"
            >
              <MessageCircle size={18} />
              Contactar por WhatsApp
            </a>
          </motion.div>

          {/* Right — Proposal text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
            className="border-l border-white/10 pl-8 sm:pl-10"
          >
            <p className="font-heading font-bold text-white/40 text-xs uppercase tracking-[0.2em] mb-5">
              La Propuesta
            </p>
            <p className="text-white/60 font-body text-base leading-relaxed">
              Incorporar Mora Protein en su vitrina permite sumar una alternativa saludable
              que dialoga de forma natural con el mundo del chocolate y el café. Es una
              propuesta que eleva la oferta saludable del local y ofrece una alternativa real
              frente a las barras industriales.
            </p>
            <p className="text-white/60 font-body text-base leading-relaxed mt-4">
              Mora Protein es una propuesta versátil, pensada para acompañar distintos
              momentos del día —el café de la mañana, el post-entreno o la pausa de media
              tarde— aportando valor a la experiencia del cliente.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {['100% Natural', 'Sin Azúcar', 'Alta Proteína', 'Hecho a Mano'].map((tag) => (
                <div key={tag} className="flex items-center gap-2 text-white/50 text-sm font-heading font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7CFC2] flex-shrink-0" />
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
