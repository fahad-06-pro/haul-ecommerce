import { useEffect, useState } from 'react'
import API from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { useWishlist } from '../context/WishlistContext'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const { wishlist: wishlistIds } = useWishlist()

  useEffect(() => {
    fetchWishlist()
  }, [])

  // Jab bhi wishlistIds change ho — products filter karo
  useEffect(() => {
    setWishlist((prev) => prev.filter((p) => wishlistIds.includes(p._id)))
  }, [wishlistIds])

  const fetchWishlist = async () => {
    try {
      const { data } = await API.get('/user/wishlist')
      setWishlist(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">
          My Wishlist ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Your wishlist is empty!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Wishlist