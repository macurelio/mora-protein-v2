import { CartProvider } from './context/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HeroSection from './components/sections/HeroSection'
import BrandTicker from './components/sections/BrandTicker'
import FeaturedProductsSection from './components/sections/FeaturedProductsSection'
import PromoSection from './components/sections/PromoSection'
import TestimonialsSection from './components/sections/TestimonialsSection'
import BrandsSection from './components/sections/BrandsSection'
import B2BSection from './components/sections/B2BSection'
import CTASection from './components/sections/CTASection'
import WelcomeModal from './components/ui/WelcomeModal'

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-charcoal">
        <Navbar />
        <main>
          <HeroSection />
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
      </div>
    </CartProvider>
  )
}
