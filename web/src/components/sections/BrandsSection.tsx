const BASE = import.meta.env.BASE_URL

const BRANDS = [
  { name: 'GreenSource', logo: `${BASE}images/brand-greensource.png` },
  { name: 'NutriWell',   logo: `${BASE}images/brand-nutriwell.png` },
  { name: 'FitLab',      logo: `${BASE}images/brand-fitlab.png` },
  { name: 'VitaPlus',    logo: `${BASE}images/brand-vitaplus.png` },
]

// Duplicate 3× so the marquee loops seamlessly
const ITEMS = [...BRANDS, ...BRANDS, ...BRANDS]

export default function BrandsSection() {
  return (
    <section aria-label="Marcas con las que trabajamos" className="relative bg-charcoal overflow-hidden py-14">
      {/* Watermark */}
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-heading font-black text-[18vw] leading-none tracking-tighter text-white/[0.04] uppercase whitespace-nowrap">
          MORA
        </span>
      </span>

      {/* Heading */}
      <div className="relative z-10 text-center mb-10">
        <p className="text-[11px] font-heading font-bold uppercase tracking-[0.25em] text-mora-light/60 mb-2">
          Alianzas
        </p>
        <h2 className="font-heading font-black text-white text-2xl sm:text-3xl uppercase tracking-wide">
          Marcas con las que trabajamos
        </h2>
      </div>

      {/* Marquee track */}
      <div className="relative z-10 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-charcoal to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-charcoal to-transparent" />

        <div className="brands-track flex items-center gap-6 w-max">
          {ITEMS.map((brand, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] rounded-2xl px-8 py-6 min-w-[180px] transition-colors duration-300 group"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-white/50 group-hover:text-white/80 text-[11px] font-heading font-bold uppercase tracking-widest transition-colors duration-300">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
