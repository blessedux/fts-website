"use client"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

const CART_KEY = "fts-evershop-cart"
const CART_UPDATE_EVENT = "fts-evershop-cart-updated"
const CART_OPEN_EVENT = "fts-evershop-cart-open"

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error("Error reading cart from localStorage", e)
    return []
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event(CART_UPDATE_EVENT))
  } catch (e) {
    console.error("Error saving cart to localStorage", e)
  }
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const items = getCartItems()
  const existing = items.find((i) => i.id === item.id)
  if (existing) {
    existing.quantity += quantity
  } else {
    items.push({ ...item, quantity })
  }
  saveCartItems(items)
  // Trigger automatic menu opening
  window.dispatchEvent(new Event(CART_OPEN_EVENT))
}

export function updateCartQuantity(id: string, quantity: number) {
  const items = getCartItems()
  const existing = items.find((i) => i.id === id)
  if (existing) {
    existing.quantity = Math.max(1, quantity)
    saveCartItems(items)
  }
}

export function removeFromCart(id: string) {
  const items = getCartItems()
  const filtered = items.filter((i) => i.id !== id)
  saveCartItems(items)
}

export function clearCart() {
  saveCartItems([])
}

export function getCartCount(): number {
  return getCartItems().reduce((acc, item) => acc + item.quantity, 0)
}

export function getCartTotal(): number {
  return getCartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
}
