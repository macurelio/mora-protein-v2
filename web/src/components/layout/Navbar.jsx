import React, { useState, useEffect } from 'react'
import { ShoppingCart, Instagram, Menu, X } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Testimonios', href: '#testimonios' },
  { label: 'Contacto', href: '#contacto' },
]

/**
 * Navbar — fixed, blur-glass header.
 * Becomes opaque after scrolling 60px. Includes mobile hamburger menu.
 */
export default function Navbar() {
  const { getCartCount } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
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
        scrolled || menuOpen
          ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-cream-border'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <a
          href="#inicio"
          className="flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora focus-visible:ring-offset-2 rounded"
          aria-label="Mora Protein — volver al inicio"
        >
          <span className="font-heading font-black text-xl sm:text-2xl text-charcoal leading-none">
            Mora
          </span>
          <span
            className="font-heading font-black text-xl sm:text-2xl leading-none"
            style={{ color: '#93326e' }}
          >
            Protein
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="px-4 py-2 rounded-lg text-sm font-heading font-bold text-charcoal hover:bg-cream-warm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/mora.protein"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Mora Protein"
            className="p-2 rounded-lg text-charcoal hover:bg-cream-warm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora"
          >
            <Instagram size={20} />
          </a>

          {/* Cart icon (visual only on landing page — links to order CTA) */}
          <a
            href="#contacto"
            aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} producto${cartCount !== 1 ? 's' : ''}` : ''}`}
            className="relative p-2 rounded-lg text-charcoal hover:bg-cream-warm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-charcoal text-white text-[9px] font-bold leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden p-2 rounded-lg text-charcoal hover:bg-cream-warm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mora"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-cream/98 backdrop-blur-md border-t border-cream-border px-4 pb-4"
        >
          <ul className="flex flex-col gap-1 pt-2" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-heading font-bold text-charcoal hover:bg-cream-warm transition-colors duration-150"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
