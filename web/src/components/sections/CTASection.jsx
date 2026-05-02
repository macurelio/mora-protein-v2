import React from 'react'
import { MessageCircle, Instagram, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'

const WHATSAPP_NUMBER = '+56954099576'
const WHATSAPP_MSG = encodeURIComponent(
  '¡Hola! Quiero hacer un pedido de Mora Protein 🍫💪',
)

/**
 * CTASection — final conversion section with WhatsApp order and social links.
 */
export default function CTASection() {
  return (
    <section
      id="contacto"
      aria-label="Sección de contacto y pedidos"
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #1a0e0a 0%, #2d1a0e 50%, #1a1a1a 100%)',
      }}
    >
      {/* Background watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span className="font-heading font-black text-[clamp(120px,30vw,360px)] text-white/[0.03] leading-none">
          Mora
        </span>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-block bg-white/10 text-white/60 text-xs font-heading font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
          ¿Listo para probar?
        </span>

        <h2 className="font-heading font-black text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5">
          Haz tu pedido{' '}
          <span className="text-[#25D366]">ahora</span> 🚀
        </h2>

        <p className="font-body text-white/50 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Envíamos a todo Chile. Pedidos mínimos, respuesta inmediata.
          Escríbenos y te asesoramos en segundos.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as="a"
            href={`whatsapp://send?text=${WHATSAPP_MSG}&phone=${WHATSAPP_NUMBER}`}
            variant="whatsapp"
            size="lg"
          >
            <MessageCircle size={20} />
            Pedir por WhatsApp
          </Button>

          <Button
            as="a"
            href="https://www.instagram.com/mora.protein"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white hover:text-charcoal"
          >
            <Instagram size={20} />
            Ver Instagram
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/40 text-xs font-heading font-bold uppercase tracking-widest">
          {['✓ Envío a todo Chile', '✓ Sin azúcar', '✓ Artesanal', '✓ Alta proteína'].map(
            (badge) => (
              <span key={badge}>{badge}</span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
