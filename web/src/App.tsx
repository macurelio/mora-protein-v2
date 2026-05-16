import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'
import AboutSection from './components/sections/AboutSection'
import BrandTicker from './components/sections/BrandTicker'
import FeaturedProductsSection from './components/sections/FeaturedProductsSection'
import PromoSection from './components/sections/PromoSection'
import TestimonialsSection from './components/sections/TestimonialsSection'
import BrandsSection from './components/sections/BrandsSection'
import B2BSection from './components/sections/B2BSection'
import CTASection from './components/sections/CTASection'
import WelcomeModal from './components/ui/WelcomeModal'
import OfferBanner from './components/ui/OfferBanner'
import OfferModal from './components/ui/OfferModal'

export default function App() {
  const [offerOpen, setOfferOpen] = useState(false)

  return (
    <CartProvider>
      <div className="min-h-screen bg-charcoal">
        <OfferBanner onOpenOffer={() => setOfferOpen(true)} />
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <BrandTicker />
          <FeaturedProductsSection />
          <PromoSection />
          <TestimonialsSection />
          <BrandsSection />
          <B2BSection />
          <CTASection />
        </main>
        <Footer />
        <WelcomeModal />
        <OfferModal open={offerOpen} onClose={() => setOfferOpen(false)} />
      </div>
    </CartProvider>
  )
}
