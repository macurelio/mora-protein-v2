import React, { createContext, useContext, useState } from 'react'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (product, options = {}) => {
    const cartItemId = `${product.id}:${options.coverage ?? 'default'}`
    setCart((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId)
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { ...product, ...options, cartItemId, quantity: 1 }]
    })
  }

  const incrementQuantity = (cartItemId) =>
    setCart((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    )

  const decrementQuantity = (cartItemId) =>
    setCart((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i,
      ),
    )

  const removeItem = (cartItemId) =>
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

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
