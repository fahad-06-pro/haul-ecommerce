import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [featuredRes, categoriesRes] = await Promise.all([
        API.get('/products/featured/list'),
        API.get('/categories')
      ])
      setFeatured(featuredRes.data)
      setCategories(categoriesRes.data)
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-950 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Shop the Latest <span className="text-green-400">Haul</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Discover trending products at unbeatable prices
          </p>
          <Link
            to="/products"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="bg-gray-900 hover:bg-gray-800 p-6 rounded-xl text-center transition"
              >
                <p className="text-white font-semibold">{cat.name}</p>
                <p className="text-gray-400 text-sm mt-1">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-green-400 hover:text-green-300 text-sm transition">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default Home