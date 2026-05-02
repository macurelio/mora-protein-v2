import React from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'
import FeaturedProductsSection from './components/sections/FeaturedProductsSection'
import TestimonialsSection from './components/sections/TestimonialsSection'
import CTASection from './components/sections/CTASection'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturedProductsSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
