import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Check, MessageCircle, CreditCard, ChevronDown, Loader2 } from 'lucide-react'
import { promos, type Promo } from '../../data/promos'
import { initiatePayment } from '../../services/api'

const WHATSAPP_NUMBER = '56954099576'
const EASE = [0.25, 1, 0.5, 1] as const

const formatPrice = (n: number) => `$${n.toLocaleString('es-CL')}`

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE, delay: i * 0.08 },
  }),
}

function PromoCard({ promo, index }: { promo: Promo; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [showPayForm, setShowPayForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [paying, setPaying] = useState(false)

  const msg = encodeURIComponent(
    `¡Hola! Quiero pedir la promoción "${promo.title}" a ${formatPrice(promo.promoPrice)} 🍫💪`,
  )
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`

  const canPay = name.trim() && email.trim() && phone.trim()

  const handleWebpay = async () => {
    if (!canPay) return
    setPaying(true)
    try {
      const buyOrder = `PROMO-${promo.id}-${Date.now()}`
      const sessionId = `sess-${Date.now()}`
      const { token, url } = await initiatePayment({
        buyOrder,
        sessionId,
        amount: promo.promoPrice,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        items: [{ name: promo.title, quantity: 1, unitPrice: promo.promoPrice }],
      })
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = url
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'token_ws'
      input.value = token
      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      console.error('Error iniciando pago:', err)
      alert('Error al conectar con Webpay. Intenta nuevamente.')
      setPaying(false)
    }
  }

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: hovered ? -6 : 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="relative flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl"
    >
      {/* Badge */}
      <span className="absolute top-3 left-3 z-20 bg-sand text-charcoal text-[10px] font-heading font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
        {promo.badge}
      </span>

      {/* Tag pill top-right */}
      <span className="absolute top-3 right-3 z-20 bg-white/10 text-sand/80 text-[10px] font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
        {promo.tag}
      </span>

      {/* Image */}
      <div className={`relative h-44 bg-gradient-to-br ${promo.gradient} overflow-hidden`}>
        <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-cover opacity-50"
          loading="lazy"
        />
        {/* Label */}
        <div className="absolute bottom-3 left-4">
          <span className="text-sand/80 text-xs font-heading font-bold">{promo.label}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-heading font-black text-sand text-xl leading-tight">
          {promo.title}
        </h3>
        <p className="text-sand/60 text-sm leading-relaxed">{promo.description}</p>

        {/* Items list */}
        <ul className="space-y-1.5 mt-1">
          {promo.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sand/70 text-xs">
              <Check size={12} className="text-sand mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="flex items-end gap-3 mt-auto pt-4 border-t border-white/10">
          <div>
            <p className="text-sand/40 text-xs line-through">{formatPrice(promo.originalPrice)}</p>
            <p className="text-sand font-heading font-black text-2xl leading-none">
              {formatPrice(promo.promoPrice)}
            </p>
          </div>
          <span className="mb-0.5 flex items-center gap-1 text-[#25D366] text-xs font-heading font-bold">
            <Tag size={11} />
            {formatPrice(promo.savings)} off
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-2 mt-1">

          {/* Transbank button */}
          <button
            type="button"
            onClick={() => setShowPayForm((v) => !v)}
            className={[
              'flex items-center justify-center gap-2 w-full py-3 rounded-xl',
              'bg-[#1c4fd8] hover:bg-[#1741bc] active:scale-[0.98]',
              'text-white font-heading font-black text-sm uppercase tracking-wide',
              'transition-all duration-150 shadow-lg shadow-blue-700/20',
            ].join(' ')}
            aria-expanded={showPayForm}
          >
            <CreditCard size={16} />
            Pagar con Transbank
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${showPayForm ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Expandable payment form */}
          <AnimatePresence initial={false}>
            {showPayForm && (
              <motion.div
                key="pay-form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2 pt-1 pb-1">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-sand placeholder:text-sand/40 text-sm border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-sand placeholder:text-sand/40 text-sm border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono (+569XXXXXXXX)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 text-sand placeholder:text-sand/40 text-sm border border-white/10 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleWebpay}
                    disabled={!canPay || paying}
                    className={[
                      'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl mt-1',
                      'bg-[#1c4fd8] hover:bg-[#1741bc] active:scale-[0.98]',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      'text-white font-heading font-black text-sm uppercase tracking-wide',
                      'transition-all duration-150',
                    ].join(' ')}
                  >
                    {paying ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <CreditCard size={15} />
                        Ir a pagar {formatPrice(promo.promoPrice)}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'flex items-center justify-center gap-2 w-full py-3 rounded-xl',
              'bg-[#25D366] hover:bg-[#20BD5C] active:scale-[0.98]',
              'text-white font-heading font-black text-sm uppercase tracking-wide',
              'transition-all duration-150 shadow-md shadow-[#25D366]/20',
            ].join(' ')}
          >
            <MessageCircle size={16} />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </motion.article>
  )
}

export default function PromoSection() {
  return (
    <section
      id="promociones"
      aria-label="Promociones y packs más vendidos"
      className="py-20 sm:py-28 bg-charcoal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={headerVariants}
        >
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-sand/70 text-xs font-heading font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <Tag size={12} />
            Promos
          </span>
          <h2 className="font-heading font-black text-sand text-4xl sm:text-5xl leading-tight">
            Lo más vendido
          </h2>
          <p className="mt-4 text-white/50 font-body text-base max-w-md mx-auto">
            Combos armados para que ahorres más y comas mejor. Disponibles por tiempo limitado.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {promos.map((promo, i) => (
            <PromoCard key={promo.id} promo={promo} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
