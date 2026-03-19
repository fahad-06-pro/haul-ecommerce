import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'

const ManageCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories')
      setCategories(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await API.post('/categories', form)
      setMessage('Category created!')
      setForm({ name: '', description: '' })
      fetchCategories()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await API.delete(`/categories/${id}`)
      fetchCategories()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Manage Categories</h1>

        {/* Create Form */}
        <form onSubmit={handleCreate} className="bg-gray-900 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          {message && <p className="text-green-400 text-sm mb-3">{message}</p>}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={form.name}
              required
              className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition text-sm">
              Create Category
            </button>
          </div>
        </form>

        {/* Categories List */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400">Name</th>
                <th className="text-left px-4 py-3 text-gray-400">Slug</th>
                <th className="text-left px-4 py-3 text-gray-400">Description</th>
                <th className="text-left px-4 py-3 text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t border-gray-800">
                  <td className="px-4 py-3 text-white">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-400">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-400">{cat.description}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-400 hover:text-red-500 transition"
                    >
                      Delete
                    </button>
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

export default ManageCategories