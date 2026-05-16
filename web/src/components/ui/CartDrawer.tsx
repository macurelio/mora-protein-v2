import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { initiatePayment } from '../../services/api'

const EASE = [0.25, 1, 0.5, 1] as const

const coverageShort = (c?: string) => {
  if (!c) return null
  if (c.toLowerCase().includes('negro')) return 'Negro'
  if (c.toLowerCase().includes('blanco')) return 'Blanco'
  return c
}

const formatPrice = (n: number) =>
  `$${n.toLocaleString('es-CL')}`

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, incrementQuantity, decrementQuantity, removeItem, getCartTotal } = useCart()
  const total = getCartTotal()
  const [paying, setPaying] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const whatsappMessage = encodeURIComponent(
    '¡Hola! Me gustaría hacer un pedido:\n' +
    cart
      .map(
        (item) =>
          `• ${item.name}${item.coverage ? ` (${coverageShort(item.coverage)})` : ''} x${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
      )
      .join('\n') +
    `\n\nTOTAL: ${formatPrice(total)}`,
  )
  const whatsappUrl = `https://wa.me/56912345678?text=${whatsappMessage}`

  const canPay = customerName.trim() && customerEmail.trim() && customerPhone.trim() && cart.length > 0

  const handleWebpay = async () => {
    if (!canPay) return
    setPaying(true)
    try {
      const buyOrder = `ORD-${Date.now()}`
      const sessionId = `session-${Date.now()}`
      const { token, url } = await initiatePayment({
        buyOrder,
        sessionId,
        amount: total,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          coverage: item.coverage,
        })),
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
      console.error('Error initiating payment:', err)
      alert('Error al conectar con Webpay. Intenta nuevamente.')
      setPaying(false)
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            className="fixed top-0 right-0 z-[160] h-full w-full max-w-sm bg-charcoal shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.9 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-sand" />
                <h2 className="font-heading font-black text-sand text-lg uppercase tracking-wide">
                  Carrito
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar carrito"
                className="p-1.5 rounded-lg text-sand/60 hover:text-sand hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
              {cart.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full gap-4 text-center py-20"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <ShoppingCart size={48} className="text-sand/20" />
                  <p className="text-sand/50 font-body text-sm">
                    Tu carrito está vacío.
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="flex gap-3 bg-white/5 rounded-xl p-3 items-start"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-white/10 flex-shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sand font-heading font-bold text-sm leading-tight truncate">
                          {item.name}
                        </p>
                        {item.coverage && (
                          <p className="text-sand/50 text-xs mt-0.5">
                            Cobertura: {coverageShort(item.coverage)}
                          </p>
                        )}
                        <p className="text-sand font-bold text-sm mt-1">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => decrementQuantity(item.cartItemId)}
                            aria-label="Reducir cantidad"
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-sand transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sand font-bold text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item.cartItemId)}
                            aria-label="Aumentar cantidad"
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-sand transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-sand font-black text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          aria-label={`Eliminar ${item.name}`}
                          className="p-1 rounded-md text-sand/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {cart.length > 0 && (
              <motion.div
                className="border-t border-white/10 px-5 py-5 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sand/70 font-body text-sm uppercase tracking-wide">
                    Total
                  </span>
                  <span className="text-sand font-heading font-black text-2xl">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 text-sand placeholder:text-sand/40 text-sm border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 text-sand placeholder:text-sand/40 text-sm border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono (+569XXXXXXXX)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 text-sand placeholder:text-sand/40 text-sm border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleWebpay}
                    disabled={!canPay || paying}
                    className={[
                      'flex items-center justify-center gap-2 w-full py-3 rounded-xl',
                      'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
                      'text-white font-heading font-black text-sm uppercase tracking-wide',
                      'transition-all duration-150 shadow-lg shadow-blue-600/20',
                    ].join(' ')}
                  >
                    <CreditCard size={18} />
                    {paying ? 'Conectando con Webpay...' : 'Pagar con Webpay Plus'}
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      'flex items-center justify-center gap-2 w-full py-3 rounded-xl',
                      'bg-[#25D366] hover:bg-[#20BD5C] active:scale-[0.98]',
                      'text-white font-heading font-black text-sm uppercase tracking-wide',
                      'transition-all duration-150 shadow-lg shadow-[#25D366]/20',
                    ].join(' ')}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Pedir por WhatsApp
                  </a>
                </div>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
