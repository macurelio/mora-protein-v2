import React from 'react'
import { CartProvider } from './context/CartContext'
// import Navbar from './components/layout/Navbar' // Eliminado header
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'
import BrandTicker from './components/sections/BrandTicker'
import FeaturedProductsSection from './components/sections/FeaturedProductsSection'
import TestimonialsSection from './components/sections/TestimonialsSection'
import B2BSection from './components/sections/B2BSection'
import CTASection from './components/sections/CTASection'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cream">
        <main>
          <HeroSection />
          <BrandTicker />
          <FeaturedProductsSection />
          <TestimonialsSection />
          <B2BSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}

