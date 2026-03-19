import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '',
    expiresAt: '',
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get('/coupons')
      setCoupons(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await API.post('/coupons', form)
      setMessage('Coupon created!')
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '' })
      fetchCoupons()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return
    try {
      await API.delete(`/coupons/${id}`)
      fetchCoupons()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Manage Coupons</h1>

        <form onSubmit={handleCreate} className="bg-gray-900 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-semibold mb-4">Create Coupon</h2>
          {message && <p className="text-green-400 text-sm mb-3">{message}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Coupon Code (e.g. SAVE20)"
              value={form.code}
              required
              className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            <select
              value={form.discountType}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none text-sm"
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed ($)</option>
            </select>
            <input
              type="number"
              placeholder="Discount Value"
              value={form.discountValue}
              required
              className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            />
            <input
              type="number"
              placeholder="Min Order Amount"
              value={form.minOrderAmount}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Uses"
              value={form.maxUses}
              className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
            />
            <input
              type="date"
              value={form.expiresAt}
              required
              className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>
          <button type="submit" className="mt-4 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition text-sm">
            Create Coupon
          </button>
        </form>

        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-gray-400">Code</th>
                <th className="text-left px-4 py-3 text-gray-400">Type</th>
                <th className="text-left px-4 py-3 text-gray-400">Value</th>
                <th className="text-left px-4 py-3 text-gray-400">Uses</th>
                <th className="text-left px-4 py-3 text-gray-400">Expires</th>
                <th className="text-left px-4 py-3 text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-t border-gray-800">
                  <td className="px-4 py-3 text-green-400 font-mono">{coupon.code}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{coupon.discountType}</td>
                  <td className="px-4 py-3 text-white">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</td>
                  <td className="px-4 py-3 text-gray-400">{coupon.usedCount}/{coupon.maxUses}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(coupon._id)} className="text-red-400 hover:text-red-500 transition">Delete</button>
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

export default ManageCoupons