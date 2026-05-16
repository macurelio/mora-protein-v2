import { Instagram, MessageCircle, Heart } from 'lucide-react'

const FOOTER_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
]

const WHATSAPP_NUMBER = '+56954099576'
const WHATSAPP_MSG = encodeURIComponent(
  '¡Hola! Quiero hacer un pedido de Mora Protein 🍫💪',
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white/60" aria-label="Pie de página">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div className="sm:col-span-1">
            <a href="#inicio" className="inline-flex items-center gap-0.5 mb-3">
              <span className="font-heading font-black text-2xl text-white leading-none">Mora</span>
              <span className="font-heading font-black text-2xl leading-none" style={{ color: '#f5c3e4' }}>
                Protein
              </span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs">
              Snacks proteicos artesanales. Sin azúcar, con sabor real. Elaborados con amor y los mejores ingredientes.
            </p>
          </div>

          <nav aria-label="Enlaces rápidos">
            <p className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-4">
              Navegación
            </p>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-4">
              Contacto
            </p>
            <div className="space-y-3">
              <a
                href={`whatsapp://send?text=${WHATSAPP_MSG}&phone=${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-150"
                aria-label="Pedir por WhatsApp"
              >
                <MessageCircle size={16} className="text-[#25D366] flex-shrink-0" />
                Pedir por WhatsApp
              </a>
              <a
                href="https://www.instagram.com/mora.protein"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-150"
                aria-label="Instagram Mora Protein"
              >
                <Instagram size={16} className="text-mora-light flex-shrink-0" />
                @mora.protein
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>&copy; {year} Mora Protein. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart size={12} className="fill-mora-light text-mora-light mx-0.5" /> en Chile
          </p>
        </div>
      </div>
    </footer>
  )
}
