import { useState, useEffect } from 'react'
import API from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [filters, page])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories')
      setCategories(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ ...filters, page, limit: 12 })
      const { data } = await API.get(`/products?${params}`)
      setProducts(data.products)
      setTotalPages(data.pages)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">All Products</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-900 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm border border-gray-800"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          {/* Custom Category Dropdown */}
          <div className="relative">
            <select
              className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm border border-gray-800 appearance-none cursor-pointer"
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-green-400">
              ▼
            </div>
          </div>

          <input
            type="number"
            placeholder="Min Price"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm border border-gray-800"
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm border border-gray-800"
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

        {/* Products Grid */}
        {loading ? <Loader /> : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No products found!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg text-sm transition ${page === i + 1 ? 'bg-green-500 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Products