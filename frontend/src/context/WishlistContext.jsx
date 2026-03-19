import { createContext, useContext, useState, useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchWishlist()
    else setWishlist([])
  }, [user])

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/user/wishlist')
      setWishlist(data.map((p) => p._id))
    } catch (error) {
      console.error(error)
    }
  }

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        await API.delete(`/user/wishlist/${productId}`)
        setWishlist(wishlist.filter((id) => id !== productId))
      } else {
        await API.post(`/user/wishlist/${productId}`)
        setWishlist([...wishlist, productId])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const isWishlisted = (productId) => wishlist.includes(productId)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)