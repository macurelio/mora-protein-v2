import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Product, CartItem, CartContextType } from '../types'

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product, options: { coverage?: string } = {}) => {
    const cartItemId = `${product.id}:${options.coverage ?? 'default'}`
    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId)
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { ...product, coverage: options.coverage, cartItemId, quantity: 1 } as CartItem]
    })
  }

  const incrementQuantity = (cartItemId: string) =>
    setCart((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    )

  const decrementQuantity = (cartItemId: string) =>
    setCart((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i,
      ),
    )

  const removeItem = (cartItemId: string) =>
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId))

  const getCartCount = () => cart.reduce((sum, i) => sum + i.quantity, 0)

  const getCartTotal = () =>
    cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        removeItem,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
