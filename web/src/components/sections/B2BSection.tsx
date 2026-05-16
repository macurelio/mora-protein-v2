import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const BASE = import.meta.env.BASE_URL
const WHATSAPP_NUMBER = '56954099576'
const WHATSAPP_MSG = encodeURIComponent(
  '¡Hola! Quiero distribuir Mora Protein en mi local 🍫',
)

const EASE = [0.25, 1, 0.5, 1] as const

export default function B2BSection() {
  return (
    <section id="trabaja" aria-label="Trabaja con nosotros" className="bg-charcoal py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">

        {/* ── Hero card: imagen de fondo + texto centrado ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[340px] flex items-center justify-center"
        >
          {/* Background image */}
          <img
            src={`${BASE}images/barras.jpg`}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            loading="lazy"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-charcoal/70" />

          {/* Content */}
          <div className="relative z-10 text-center px-6 py-12 flex flex-col items-center gap-5">
            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.28em] text-white/50 border border-white/15 px-4 py-1.5 rounded-full">
              Para locales y gimnasios
            </span>

            <h2 className="font-heading font-black text-white text-3xl sm:text-5xl leading-tight">
              Trabaja con{' '}
              <span className="text-sand">Nosotros</span>
            </h2>

            <p className="text-white/65 text-base sm:text-lg max-w-md leading-relaxed">
              ¿Quieres distribuir Mora Protein en tu local o gimnasio?{' '}
              <span className="text-white/90 font-medium">Conversemos.</span>
            </p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-sand text-charcoal font-heading font-bold text-sm uppercase tracking-widest hover:bg-sand/80 transition-colors duration-200 mt-1"
            >
              <MessageCircle size={18} />
              Contactar por WhatsApp
            </a>
          </div>
        </motion.div>

        {/* ── La Propuesta card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.12 }}
          className="rounded-3xl bg-white/[0.05] border border-white/10 px-8 py-10 sm:px-12 sm:py-12"
        >
          <h3 className="font-heading font-black text-sand text-xl sm:text-2xl uppercase tracking-wide mb-5">
            La Propuesta
          </h3>
          <p className="text-white/65 font-body text-base sm:text-lg leading-relaxed">
            Incorporar Mora Protein en su vitrina permite sumar una alternativa saludable
            que dialoga de forma natural con el mundo del chocolate y el café. Es una
            propuesta que eleva la oferta saludable del local y ofrece una alternativa
            real frente a las barras industriales. Mora Protein es una propuesta versátil,
            pensada para acompañar distintos momentos del día —el café de la mañana, el
            post-entreno o la pausa de media tarde— aportando valor a la experiencia del
            cliente.
          </p>
        </motion.div>


      </div>
    </section>
  )
}
