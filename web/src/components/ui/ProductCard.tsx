import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, Check } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import type { ProductCardProps } from '../../types'

const EASE = [0.25, 1, 0.5, 1] as const

/** Exported so parent grids can apply stagger */
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [selectedCoverage, setSelectedCoverage] = useState<string | null>(
    product.coverageOptions?.[0] ?? null,
  )
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    const options = selectedCoverage ? { coverage: selectedCoverage } : {}
    for (let i = 0; i < qty; i++) addToCart(product, options)
    setAdded(true)
    setTimeout(() => { setAdded(false); setQty(1) }, 1800)
  }

  const coverageLabel = (opt: string) => {
    if (opt.toLowerCase().includes('negro')) return 'Negro'
    if (opt.toLowerCase().includes('blanco')) return 'Blanco'
    return opt
  }

  return (
    <motion.article
      variants={cardVariants}
      className="flex flex-col bg-white border border-cream-border rounded-2xl overflow-hidden"
      whileHover={{ y: -4, boxShadow: '0 16px 40px -8px rgba(26,26,26,0.12)' }}
      transition={{ duration: 0.28, ease: EASE }}
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden"
        style={{
          height: '220px',
          background: !product.image
            ? `linear-gradient(135deg, ${product.gradientFrom} 0%, ${product.gradientTo} 100%)`
            : undefined,
        }}
      >
        {product.image ? (
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 font-heading font-black text-6xl select-none">MP</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-mora text-white text-[10px] font-heading font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
            {product.badge}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Price + category */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs font-heading font-bold text-muted uppercase tracking-widest">
            {product.category}
          </span>
          <span className="font-heading font-black text-charcoal text-xl leading-none">
            ${product.price.toLocaleString('es-CL')}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-heading font-black text-charcoal text-lg leading-tight">
          {product.name}
        </h3>

        {/* Protein + sin azúcar badge */}
        <p className="text-xs font-heading font-bold text-muted uppercase tracking-widest">
          {product.protein} Proteína&nbsp;·&nbsp;Sin Azúcar
        </p>

        {/* Coverage selector */}
        {product.coverageOptions?.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">
              Cobertura:
            </p>
            <div className="flex gap-2">
              {product.coverageOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedCoverage(opt)}
                  className={[
                    'text-xs font-heading font-bold px-3 py-1.5 rounded-lg border-2 transition-all duration-150',
                    selectedCoverage === opt
                      ? 'bg-charcoal border-charcoal text-white'
                      : 'bg-white border-cream-border text-muted hover:border-charcoal',
                  ].join(' ')}
                >
                  {coverageLabel(opt)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add button */}
        <div className="flex items-center gap-3 mt-auto pt-1">
          {/* Quantity */}
          <div className="flex items-center gap-1 border border-cream-border rounded-xl overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Reducir cantidad"
              className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-cream-warm transition-colors duration-150"
            >
              <Minus size={13} />
            </button>
            <span className="w-7 text-center text-sm font-heading font-bold text-charcoal">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Aumentar cantidad"
              className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-cream-warm transition-colors duration-150"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Add CTA */}
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className={[
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl',
              'font-heading font-bold text-xs uppercase tracking-widest text-white transition-colors duration-200',
              added ? 'bg-[#25D366]' : 'bg-charcoal hover:bg-cocoa',
            ].join(' ')}
          >
            {added ? (
              <>
                <Check size={13} />
                Agregado
              </>
            ) : (
              'Agregar'
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

