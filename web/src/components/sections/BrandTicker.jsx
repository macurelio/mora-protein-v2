import React from 'react'

const PARTNERS = [
  'Sin Gluten',
  'Sin Azúcar',
  '100% Natural',
  'Hecho a Mano',
  'Alta Proteína',
  'Sin Gluten',
  'Sin Azúcar',
  '100% Natural',
  'Hecho a Mano',
  'Alta Proteína',
]

/**
 * BrandTicker — infinite CSS marquee strip between hero and products.
 * Matches the reference site's scrolling brand/tag bar.
 */
export default function BrandTicker() {
  return (
    <div
      className="bg-charcoal border-y border-white/10 py-4 overflow-hidden"
      aria-hidden
    >
      <div className="ticker-track flex items-center gap-10 w-max">
        {[...PARTNERS, ...PARTNERS].map((label, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-white/50 text-xs font-heading font-bold uppercase tracking-[0.2em] whitespace-nowrap"
          >
            <span className="w-1 h-1 rounded-full bg-[#D7CFC2] inline-block" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
