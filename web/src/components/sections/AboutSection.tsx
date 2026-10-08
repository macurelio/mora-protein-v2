import { motion } from 'framer-motion'
import { Salad, Flame, Sunrise, type LucideIcon } from 'lucide-react'
import { COMUNAS } from '../../config'

const EASE = [0.25, 1, 0.5, 1] as const

interface Moment {
  icon: LucideIcon
  label: string
  description: string
  iconClass: string
  bgClass: string
}

const MOMENTS: Moment[] = [
  {
    icon: Salad,
    label: 'Ensalada de la semana',
    description:
      'Hojas frescas del día, tomate maduro y palta en su punto. Ensaladas ricas todos los días de la semana.',
    iconClass: 'text-sand',
    bgClass: 'bg-sand/10',
  },
  {
    icon: Flame,
    label: 'La olla de la casa',
    description:
      'Cazuelas, sopas y guisos con las raíces y tubérculos del campo chileno. Sabor de siempre, directo del campo.',
    iconClass: 'text-sand',
    bgClass: 'bg-sand/10',
  },
  {
    icon: Sunrise,
    label: 'Desayuno y colación',
    description:
      'Fruta madura y lista para comer. Un desayuno completo o una colación saludable sin salir de casa.',
    iconClass: 'text-cream-warm',
    bgClass: 'bg-cocoa/20',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

export default function AboutSection() {
  return (
    <section
      id="nosotros"
      aria-label="Quiénes somos"
      className="relative py-24 sm:py-32 bg-[#111111] overflow-hidden"
    >
      {/* Background accent blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-[0.07] bg-cocoa"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={containerVariants}
          >
            <motion.span
              variants={itemVariants}
              className="inline-block text-xs font-heading font-bold uppercase tracking-[0.2em] text-sand/70 mb-5"
            >
              Quiénes somos
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="font-heading font-black text-sand text-4xl sm:text-5xl leading-[1.1] mb-8"
            >
              Del campo<br />
              <span className="text-white/30">a tu mesa</span>{' '}
              en el día.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="font-body text-white/60 text-lg leading-relaxed max-w-lg mb-10"
            >
              Mora Verduras selecciona cada pieza a mano y te la lleva a domicilio{' '}
              <span className="text-sand/80">sin intermediarios</span>.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="font-body text-white/40 text-base leading-relaxed max-w-lg"
            >
              Pedidos por WhatsApp en 30 segundos: eliges tu canasta, el día de entrega y
              pagas al recibir. Producto fresco o te devolvemos tu dinero.
            </motion.p>
          </motion.div>

          {/* Right — moment cards */}
          <motion.div
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={containerVariants}
          >
            {MOMENTS.map(({ icon: Icon, label, description, iconClass, bgClass }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                className="flex items-start gap-5 rounded-2xl bg-white/[0.04] border border-white/[0.07] px-6 py-5 hover:bg-white/[0.06] transition-colors duration-200"
              >
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5 ${bgClass}`}
                >
                  <Icon size={20} className={iconClass} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-heading font-bold text-sand text-sm mb-1.5">{label}</p>
                  <p className="font-body text-white/50 text-sm leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom stat strip */}
        <motion.div
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
        >
          {[
            { value: '24h', label: 'Entrega en el día' },
            { value: '100%', label: 'Producto del día' },
            { value: `${COMUNAS.length}`, label: 'Comunas con envío' },
            { value: '4', label: 'Categorías' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-8 px-4 bg-[#111111] hover:bg-white/[0.03] transition-colors duration-200"
            >
              <span className="font-heading font-black text-sand text-3xl sm:text-4xl leading-none mb-2">
                {value}
              </span>
              <span className="font-body text-white/40 text-xs uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
