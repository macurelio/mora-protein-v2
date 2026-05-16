import { useEffect, useState } from 'react'
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
import PaymentResultModal from './components/ui/PaymentResultModal'
import type { PaymentResult } from './types'

function usePaymentResult() {
  const [result, setResult] = useState<PaymentResult>(null)

  useEffect(() => {
    const path = window.location.pathname
    const params = new URLSearchParams(window.location.search)

    if (path.endsWith('/checkout/success')) {
      setResult({ status: 'success', order: params.get('order') ?? '' })
      window.history.replaceState({}, '', '/mora-protein-v2/')
    } else if (path.endsWith('/checkout/failure')) {
      setResult({ status: 'failure', reason: params.get('reason') ?? 'unknown' })
      window.history.replaceState({}, '', '/mora-protein-v2/')
    }
  }, [])

  return result
}

export default function App() {
  const [offerOpen, setOfferOpen] = useState(false)
  const paymentResult = usePaymentResult()

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
        <PaymentResultModal result={paymentResult} onClose={() => {}} />
      </div>
    </CartProvider>
  )
}
