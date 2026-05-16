import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '56954099576'
const WHATSAPP_MSG = encodeURIComponent(
  '¡Hola! Quiero distribuir Mora Protein en mi local 🍫',
)

export default function B2BSection() {
  return (
    <section id="trabaja" aria-label="Trabaja con nosotros" className="py-20 sm:py-28 bg-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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

          {/* Product image panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/barras.jpg`}
              alt="Barras de proteína Mora Protein"
              className="w-full h-72 lg:h-96 object-cover object-center"
              loading="lazy"
            />
            {/* Overlay with tags */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {['100% Natural', 'Sin Azúcar', 'Alta Proteína', 'Hecho a Mano'].map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-heading font-bold px-3 py-1.5 rounded-full border border-white/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7CFC2] flex-shrink-0" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Cuadro informativo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
          className="mt-16 rounded-2xl overflow-hidden border border-white/10"
        >
          <img
            src={`${import.meta.env.BASE_URL}images/imagen-horizontal-de.png`}
            alt="Cuadro informativo de productos Mora Protein"
            className="w-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  )
}
