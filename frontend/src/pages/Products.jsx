import { useState, useEffect, useRef } from 'react'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchProducts()
  }, [filters, page])

  useEffect(() => {
    fetchCategories()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const handleCategorySelect = (catId, catName) => {
    setSelectedCategory(catName)
    setFilters({ ...filters, category: catId })
    setDropdownOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">All Products</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-900 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm border border-gray-800"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          {/* Modern Custom Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm border transition-all duration-200"
              style={{
                background: dropdownOpen
                  ? 'linear-gradient(135deg, #052e16, #14532d)'
                  : '#111827',
                border: dropdownOpen
                  ? '1px solid #22c55e'
                  : '1px solid #1f2937',
                color: selectedCategory === 'All Categories' ? '#9ca3af' : '#ffffff',
                boxShadow: dropdownOpen ? '0 0 12px rgba(34,197,94,0.2)' : 'none',
              }}
            >
              <span className="font-medium">{selectedCategory}</span>
              <span
                className="text-green-400 transition-transform duration-200"
                style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute top-full left-0 w-full mt-2 rounded-xl overflow-hidden z-50"
                style={{
                  background: '#0f172a',
                  border: '1px solid #22c55e',
                  boxShadow: '0 8px 32px rgba(34,197,94,0.15)',
                }}
              >
                {/* All Categories Option */}
                <button
                  onClick={() => handleCategorySelect('', 'All Categories')}
                  className="w-full text-left px-4 py-3 text-sm font-semibold transition-all duration-150 flex items-center gap-3"
                  style={{
                    background: selectedCategory === 'All Categories'
                      ? 'linear-gradient(135deg, #052e16, #14532d)'
                      : 'transparent',
                    color: selectedCategory === 'All Categories' ? '#22c55e' : '#9ca3af',
                    borderBottom: '1px solid #1e293b',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== 'All Categories') {
                      e.currentTarget.style.background = '#1e293b'
                      e.currentTarget.style.color = '#ffffff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== 'All Categories') {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#9ca3af'
                    }
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: selectedCategory === 'All Categories' ? '#22c55e' : '#374151',
                    }}
                  />
                  All Categories
                </button>

                {/* Category Options */}
                {categories.map((cat, index) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat._id, cat.name)}
                    className="w-full text-left px-4 py-3 text-sm font-medium transition-all duration-150 flex items-center gap-3"
                    style={{
                      background: selectedCategory === cat.name
                        ? 'linear-gradient(135deg, #052e16, #14532d)'
                        : 'transparent',
                      color: selectedCategory === cat.name ? '#22c55e' : '#d1d5db',
                      borderBottom: index < categories.length - 1 ? '1px solid #1e293b' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== cat.name) {
                        e.currentTarget.style.background = '#1e293b'
                        e.currentTarget.style.color = '#ffffff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== cat.name) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#d1d5db'
                      }
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: selectedCategory === cat.name ? '#22c55e' : '#374151',
                      }}
                    />
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Min Price */}
          <input
            type="number"
            placeholder="Min Price"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm border border-gray-800"
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />

          {/* Max Price */}
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
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      page === i + 1
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
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