import { Leaf, Zap, Wheat, Droplets, HandMetal } from 'lucide-react'

const ATTRIBUTES = [
  { label: 'Sin Gluten',    Icon: Wheat },
  { label: 'Sin Azúcar',   Icon: Droplets },
  { label: '100% Natural', Icon: Leaf },
  { label: 'Hecho a Mano', Icon: HandMetal },
  { label: 'Alta Proteína',Icon: Zap },
]

export default function BrandTicker() {
  const items = [...ATTRIBUTES, ...ATTRIBUTES, ...ATTRIBUTES]
  return (
    <div className="bg-charcoal border-y border-white/10 py-3.5 overflow-hidden" aria-hidden>
      <div className="ticker-track flex items-center gap-8 w-max">
        {items.map((attr, i) => (
          <span
            key={i}
            className="flex items-center gap-2.5 text-white/55 text-[11px] font-heading font-bold uppercase tracking-[0.22em] whitespace-nowrap"
          >
            <attr.Icon size={14} className="opacity-75 flex-shrink-0" aria-hidden />
            {attr.label}
          </span>
        ))}
      </div>
    </div>
  )
}
