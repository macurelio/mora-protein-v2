import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'

interface OfferBannerProps {
  onOpenOffer: () => void
}

export default function OfferBanner({ onOpenOffer }: OfferBannerProps) {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="relative z-50 bg-gradient-to-r from-[#2e1a08] via-cocoa to-[#2e1a08]"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center gap-2.5 px-10 py-2.5 text-sm">
            <Zap size={13} className="fill-white text-white flex-shrink-0" />
            <p className="text-white/90 font-body text-center leading-snug">
              <span className="font-heading font-black text-white">⚡ OFERTA DEL DÍA:</span>{' '}
              Box Mixto Proteico con{' '}
              <span className="font-heading font-black text-white">$2.500 de descuento</span>
              {' '}· Solo por hoy
            </p>
            <button
              onClick={onOpenOffer}
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-heading font-black text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap"
            >
              Ver oferta →
            </button>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
            aria-label="Cerrar anuncio"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
