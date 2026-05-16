import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import type { PaymentResult } from '../../types'

interface PaymentResultModalProps {
  result: PaymentResult
  onClose: () => void
}

export default function PaymentResultModal({ result, onClose }: PaymentResultModalProps) {
  useEffect(() => {
    if (!result) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [result])

  const isSuccess = result?.status === 'success'

  return createPortal(
    <AnimatePresence>
      {result && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-[210] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div className="bg-charcoal border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
              {isSuccess ? (
                <CheckCircle size={56} className="mx-auto text-green-400 mb-4" />
              ) : (
                <XCircle size={56} className="mx-auto text-red-400 mb-4" />
              )}

              <h2 className="font-heading font-black text-2xl text-sand mb-2">
                {isSuccess ? '¡Pago exitoso!' : 'Pago rechazado'}
              </h2>

              <p className="text-sand/60 font-body text-sm mb-1">
                {isSuccess
                  ? `Tu orden ${result.order} ha sido confirmada.`
                  : result.reason === 'rejected'
                    ? 'La transacción fue rechazada. Intenta con otro medio de pago.'
                    : 'Ocurrió un error al procesar el pago. Intenta nuevamente.'}
              </p>

              {isSuccess && (
                <p className="text-sand/40 font-body text-xs">
                  Recibirás un WhatsApp con los detalles de tu pedido.
                </p>
              )}

              <button
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sand/10 hover:bg-sand/20 text-sand font-heading font-bold text-sm transition-colors"
              >
                <X size={16} />
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
