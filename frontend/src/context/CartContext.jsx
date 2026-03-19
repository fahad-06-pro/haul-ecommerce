import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchCart()
    else setCart({ items: [], totalPrice: 0 })
  }, [user])

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart')
      setCart(data)
    } catch (error) {
      console.error('Cart fetch error:', error)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true)
    try {
      const { data } = await API.post('/cart/add', { productId, quantity })
      setCart(data)
    } catch (error) {
      console.error('Add to cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCart = async (productId, quantity) => {
    setLoading(true)
    try {
      const { data } = await API.put('/cart/update', { productId, quantity })
      setCart(data)
    } catch (error) {
      console.error('Update cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (productId) => {
    setLoading(true)
    try {
      const { data } = await API.delete(`/cart/remove/${productId}`)
      setCart(data)
    } catch (error) {
      console.error('Remove from cart error:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      await API.delete('/cart/clear')
      setCart({ items: [], totalPrice: 0 })
    } catch (error) {
      console.error('Clear cart error:', error)
    }
  }

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)