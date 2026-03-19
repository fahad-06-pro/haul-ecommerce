import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'

const ManageProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: '', stock: '', featured: false, tags: '',
  })
  const [images, setImages] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories'),
      ])
      setProducts(productsRes.data.products)
      setCategories(categoriesRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setMessage('')
  const formData = new FormData()
  Object.keys(form).forEach((key) => formData.append(key, form[key]))
  images.forEach((img) => formData.append('images', img))

  try {
    if (editProduct) {
      await API.put(`/products/${editProduct._id}`, formData)
      setMessage('✅ Product updated successfully!')
    } else {
      await API.post('/products', formData)
      setMessage('✅ Product created successfully!')
    }
    setShowForm(false)
    setEditProduct(null)
    setForm({ name: '', description: '', price: '', discountPrice: '', category: '', stock: '', featured: false, tags: '' })
    setImages([])
    fetchData()
  } catch (error) {
  setMessage(`❌ ${error.response?.data?.message || error.response?.data?.error || 'Something went wrong — check image format!'}`)
  setShowForm(true)
}
}
  const handleEdit = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category?._id || '',
      stock: product.stock,
      featured: product.featured,
      tags: product.tags?.join(', ') || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditProduct(null) }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl mb-8">
            <h2 className="text-lg font-semibold mb-4">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
            {message && <p className="text-green-400 text-sm mb-3">{message}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Product Name" value={form.name} required
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <select value={form.category} required
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none text-sm"
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
              <input type="number" placeholder="Price" value={form.price} required
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input type="number" placeholder="Discount Price (optional)" value={form.discountPrice}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
              <input type="number" placeholder="Stock" value={form.stock} required
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              <input type="text" placeholder="Tags (comma separated)" value={form.tags}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              <textarea placeholder="Description" value={form.description} required rows={3}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none sm:col-span-2"
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={form.featured} id="featured"
                  className="accent-green-500 w-4 h-4"
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured" className="text-sm text-gray-400">Featured Product</label>
              </div>
              <input type="file" multiple accept="image/*"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg text-sm"
                onChange={(e) => setImages(Array.from(e.target.files))} />
            </div>
            <button type="submit" className="mt-4 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition text-sm">
              {editProduct ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        )}

        {/* Products Table */}
        <div className="bg-gray-900 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400">Product</th>
                <th className="text-left px-4 py-3 text-gray-400">Category</th>
                <th className="text-left px-4 py-3 text-gray-400">Price</th>
                <th className="text-left px-4 py-3 text-gray-400">Stock</th>
                <th className="text-left px-4 py-3 text-gray-400">Featured</th>
                <th className="text-left px-4 py-3 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/40'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <span className="text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{product.category?.name}</td>
                  <td className="px-4 py-3 text-green-400">${product.discountPrice || product.price}</td>
                  <td className="px-4 py-3 text-white">{product.stock}</td>
                  <td className="px-4 py-3">{product.featured ? '✅' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-500 transition">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-500 transition">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ManageProducts