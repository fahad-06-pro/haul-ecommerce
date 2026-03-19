import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', form)

      if (data.user.role !== 'admin') {
        setError('Access denied. Admins only!')
        setLoading(false)
        return
      }

      login(data.token, data.user)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-md">

        {/* Admin Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full">
            <span className="text-yellow-400 text-xs font-semibold">⚡ ADMIN PORTAL</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
        <p className="text-gray-400 text-sm mb-6">Haul Dashboard Access</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Admin Email</label>
            <input
              type="email"
              placeholder="admin@haul.com"
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-700 text-black font-semibold py-3 rounded-lg transition text-sm"
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <p className="text-gray-600 text-xs mt-6 text-center">
          This portal is for authorized personnel only
        </p>
      </div>
    </div>
  )
}

export default AdminLogin