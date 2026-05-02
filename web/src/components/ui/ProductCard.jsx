import React, { useState } from 'react'
import { ShoppingCart, Check, Zap } from 'lucide-react'
import { useCart } from '../../context/CartContext'

/**
 * Product card used in the ProductCarousel (Carousel B).
 * Shows gradient placeholder when no image is provided.
 */
export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [selectedCoverage, setSelectedCoverage] = useState(
    product.coverageOptions?.[0] ?? null,
  )
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    const options = selectedCoverage ? { coverage: selectedCoverage } : {}
    addToCart(product, options)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className="relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-cream-border transition-shadow duration-300 h-full">
      {/* Image / Gradient placeholder */}
      <div
        className="relative h-44 sm:h-52 flex-shrink-0 overflow-hidden"
        style={{
          background: product.image
            ? undefined
            : `linear-gradient(135deg, ${product.gradientFrom} 0%, ${product.gradientTo} 100%)`,
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-white/20 font-heading font-black text-5xl leading-none select-none">
              MP
            </span>
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-charcoal/90 backdrop-blur-sm text-white text-sm font-heading font-bold px-3 py-1 rounded-xl">
          ${product.price.toLocaleString('es-CL')}
        </div>

        {/* New / Special badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-mora text-white text-xs font-heading font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
            {product.badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category + Protein */}
        <div className="flex items-center justify-between">
          <span className="bg-cream-warm text-cocoa text-[10px] font-heading font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
            {product.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-heading font-bold text-mora">
            <Zap size={11} className="fill-mora stroke-mora" />
            {product.protein} prot.
          </span>
        </div>

        <h3 className="font-heading font-black text-charcoal text-base leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted text-xs leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Coverage selector */}
        {product.coverageOptions?.length > 0 && (
          <div className="mt-1">
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">
              Cobertura
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.coverageOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedCoverage(opt)}
                  className={[
                    'text-[11px] font-heading font-bold px-2.5 py-1 rounded-lg border-2 transition-colors duration-150',
                    selectedCoverage === opt
                      ? 'bg-charcoal border-charcoal text-white'
                      : 'bg-white border-cream-border text-muted hover:border-charcoal',
                  ].join(' ')}
                >
                  {opt === 'Chocolate Negro' ? 'Negro' : opt === 'Chocolate Blanco' ? 'Blanco' : opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className={[
            'mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl',
            'font-heading font-bold text-sm text-white transition-all duration-200',
            added
              ? 'bg-[#25D366] scale-95'
              : 'bg-charcoal hover:bg-cocoa active:scale-95',
          ].join(' ')}
        >
          {added ? (
            <>
              <Check size={15} />
              Agregado
            </>
          ) : (
            <>
              <ShoppingCart size={15} />
              Agregar
            </>
          )}
        </button>
      </div>
    </article>
  )
}
