import { motion } from 'framer-motion'
import { Coffee, Dumbbell, Sun, type LucideIcon } from 'lucide-react'

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
    icon: Coffee,
    label: 'Café de la mañana',
    description: 'Comienza el día con energía real. Una barra o galletón junto a tu café es el ritual perfecto.',
    iconClass: 'text-sand',
    bgClass: 'bg-sand/10',
  },
  {
    icon: Dumbbell,
    label: 'Post-entreno',
    description: 'Recupera con proteína de calidad. Sin azúcar, sin rellenos — solo lo que tu cuerpo necesita.',
    iconClass: 'text-sand',
    bgClass: 'bg-sand/10',
  },
  {
    icon: Sun,
    label: 'Pausa de media tarde',
    description: 'Ese momento de antojo sin culpa. Snacks reales que sacian y saben increíble.',
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

const BASE = import.meta.env.BASE_URL

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
              Artesanal,<br />
              <span className="text-white/30">natural</span>{' '}
              y fresco.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="font-body text-white/60 text-lg leading-relaxed max-w-lg mb-10"
            >
              Desarrollamos productos artesanales, naturales y frescos, pensados para quienes buscan{' '}
              <span className="text-sand/80">cuidarse sin dejar de disfrutar</span>.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="font-body text-white/40 text-base leading-relaxed max-w-lg"
            >
              Sin azúcar añadida, con opciones veganas y siempre elaborados con los mejores ingredientes. Cada mordisco es intencional.
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
            { value: '100%', label: 'Artesanal' },
            { value: '0g', label: 'Azúcar añadida' },
            { value: '15g', label: 'Proteína / barra' },
            { value: '3+', label: 'Categorías' },
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
