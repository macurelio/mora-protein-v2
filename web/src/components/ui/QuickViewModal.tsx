import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Check } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

const EASE = [0.25, 1, 0.5, 1] as const

const coverageLabel = (opt: string) => {
  if (opt.toLowerCase().includes('negro')) return 'Negro'
  if (opt.toLowerCase().includes('blanco')) return 'Blanco'
  return opt
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart()
  const [selectedCoverage, setSelectedCoverage] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedCoverage(product.coverageOptions?.[0] ?? null)
      setQty(1)
      setAdded(false)
    }
  }, [product])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [product])

  const handleAdd = () => {
    if (!product) return
    const options = selectedCoverage ? { coverage: selectedCoverage } : {}
    for (let i = 0; i < qty; i++) addToCart(product, options)
    setAdded(true)
    setTimeout(() => { setAdded(false); setQty(1) }, 1800)
  }

  // Resolve the image to display based on selected coverage
  const displayImage =
    product && selectedCoverage && product.imageByCoverage?.[selectedCoverage]
      ? product.imageByCoverage[selectedCoverage]
      : product?.image ?? null

  return createPortal(
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Vista rápida: ${product.name}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg lg:max-w-2xl max-h-[92vh] flex flex-col lg:flex-row">

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar vista rápida"
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-charcoal hover:bg-cream transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora"
              >
                <X size={16} />
              </button>

              {/* Image */}
              <div
                className="lg:w-[44%] flex-shrink-0 relative h-52 lg:h-auto overflow-hidden"
                // eslint-disable-next-line react/forbid-dom-props
                style={!displayImage ? { background: `linear-gradient(135deg, ${product.gradientFrom} 0%, ${product.gradientTo} 100%)` } : undefined}
              >
                {displayImage ? (
                  <AnimatePresence mode="crossfade" initial={false}>
                    <motion.img
                      key={displayImage}
                      src={displayImage}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.38, ease: EASE }}
                    />
                  </AnimatePresence>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/20 font-heading font-black text-6xl select-none">MP</span>
                  </div>
                )}

                {product.badge && (
                  <div className="absolute top-3 left-3 bg-cocoa text-sand text-[10px] font-heading font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                    {product.badge}
                  </div>
                )}

                {/* Color stripe by coverage */}
                {selectedCoverage && product.colorByCoverage?.[selectedCoverage] && (
                  <motion.div
                    key={selectedCoverage}
                    className="absolute top-0 inset-x-0 h-[6px] z-10"
                    style={{ backgroundColor: product.colorByCoverage[selectedCoverage] }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 gap-4 overflow-y-auto">
                {/* Category */}
                <span className="text-xs font-heading font-bold text-muted uppercase tracking-widest">
                  {product.category}
                </span>

                {/* Name + price */}
                <div>
                  <h2 className="font-heading font-black text-charcoal text-2xl leading-tight">
                    {product.name}
                  </h2>
                  <p className="mt-1 font-heading font-black text-cocoa text-2xl">
                    ${product.price.toLocaleString('es-CL')}
                  </p>
                </div>

                {/* Protein badge */}
                <p className="text-xs font-heading font-bold text-muted uppercase tracking-widest">
                  {product.protein} Proteína&nbsp;·&nbsp;Sin Azúcar
                </p>

                {/* Description */}
                {product.description && (
                  <p className="text-sm font-body text-charcoal/70 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Coverage selector */}
                {product.coverageOptions?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">
                      Cobertura:
                    </p>
                    <div className="flex gap-2">
                      {product.coverageOptions.map((opt) => {
                        const swatchColor = product.colorByCoverage?.[opt]
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedCoverage(opt)}
                            className={[
                              'flex items-center gap-1.5 text-xs font-heading font-bold px-3 py-1.5 rounded-lg border-2 transition-all duration-150',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora focus-visible:ring-offset-1',
                              selectedCoverage === opt
                                ? 'bg-charcoal border-charcoal text-white'
                                : 'bg-white border-cream-border text-muted hover:border-charcoal',
                            ].join(' ')}
                            aria-pressed={selectedCoverage === opt ? 'true' : 'false'}
                            aria-label={`Cobertura ${coverageLabel(opt)}`}
                          >
                            {swatchColor && (
                              <span
                                className="inline-block w-3 h-3 rounded-full border border-black/10 flex-shrink-0"
                                style={{ backgroundColor: swatchColor }}
                                aria-hidden="true"
                              />
                            )}
                            {coverageLabel(opt)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Qty + Add */}
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <div className="flex items-center gap-1 border border-cream-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Reducir cantidad"
                      className="w-9 h-9 flex items-center justify-center text-charcoal hover:bg-cream transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mora"
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      className="w-8 text-center text-sm font-heading font-bold text-charcoal select-none"
                      aria-live="polite"
                      aria-label={`Cantidad: ${qty}`}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Aumentar cantidad"
                      className="w-9 h-9 flex items-center justify-center text-charcoal hover:bg-cream transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-mora"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <motion.button
                    onClick={handleAdd}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.14 }}
                    className={[
                      'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl',
                      'font-heading font-bold text-sm uppercase tracking-widest text-white transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora focus-visible:ring-offset-2',
                      added ? 'bg-[#25D366]' : 'bg-charcoal hover:bg-cocoa active:bg-cocoa/90',
                    ].join(' ')}
                    aria-label={added ? 'Agregado al carrito' : 'Agregar al carrito'}
                  >
                    {added ? (
                      <>
                        <Check size={14} aria-hidden="true" />
                        Agregado
                      </>
                    ) : (
                      'Agregar al carrito'
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
