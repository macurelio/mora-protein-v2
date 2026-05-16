import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Instagram, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import CartDrawer from '../ui/CartDrawer'

const BASE = import.meta.env.BASE_URL

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
]

function AboutUsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-modal-title"
          className="relative z-10 bg-charcoal rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 p-1 rounded-lg text-sand/60 hover:text-sand hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          <img
            src={`${BASE}images/logo-cuadrado.png`}
            alt="Mora Protein"
            className="h-14 w-14 object-contain rounded-md"
          />

          <h2
            id="about-modal-title"
            className="font-heading font-black text-sand text-xl tracking-wide uppercase"
          >
            Quiénes Somos
          </h2>

          <p className="text-sand/80 text-sm text-center leading-relaxed">
            Mora Protein es una marca de snacks saludables hechos a mano, sin azúcar, altos en proteína y con opciones veganas.
          </p>
          <p className="text-sand/80 text-sm text-center leading-relaxed">
            Desarrollamos productos artesanales, naturales y frescos, pensados para quienes buscan cuidarse sin dejar de disfrutar. Nuestra propuesta combina nutrición y sabor en formatos prácticos, accesibles y fáciles de integrar al día a día.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

export default function Navbar() {
  const { getCartCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const cartCount = getCartCount()

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-charcoal shadow-lg shadow-black/30'
          : 'bg-charcoal/80 backdrop-blur-md',
        menuOpen ? 'bg-charcoal' : '',
      ].join(' ')}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-lg"
          aria-label="Mora Protein — volver al inicio"
        >
          <img
            src={`${BASE}images/logo-cuadrado.png`}
            alt="Mora Protein"
            className="h-10 w-10 object-contain rounded-md"
          />
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className={[
                  'px-4 py-2 rounded-lg text-sm font-heading font-bold transition-colors duration-150',
                  'text-sand/80 hover:text-sand hover:bg-white/10',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand',
                ].join(' ')}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => setAboutOpen(true)}
              className={[
                'px-4 py-2 rounded-lg text-sm font-heading font-bold transition-colors duration-150',
                'text-sand/80 hover:text-sand hover:bg-white/10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand',
              ].join(' ')}
            >
              Quiénes Somos
            </button>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/mora.protein"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Mora Protein"
            className="p-2 rounded-lg text-sand/80 hover:text-sand hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            <Instagram size={20} />
          </a>

          <button
            onClick={() => setCartOpen(true)}
            aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} producto${cartCount !== 1 ? 's' : ''}` : ''}`}
            className="relative p-2 rounded-lg text-sand/80 hover:text-sand hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-sand text-charcoal text-[9px] font-bold leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen ? 'true' : 'false'}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden p-2 rounded-lg text-sand/80 hover:text-sand hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-charcoal border-t border-white/10 px-4 pb-4"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-heading font-bold text-sand/80 hover:text-sand hover:bg-white/10 transition-colors duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setMenuOpen(false); setAboutOpen(true) }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-heading font-bold text-sand/80 hover:text-sand hover:bg-white/10 transition-colors duration-150"
              >
                Quiénes Somos
              </button>
            </li>
          </ul>
        </div>
      )}

      {aboutOpen && <AboutUsModal onClose={() => setAboutOpen(false)} />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
