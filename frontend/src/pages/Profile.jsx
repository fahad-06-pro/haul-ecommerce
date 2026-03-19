import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Profile = () => {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', address: { street: '', city: '', country: '', zipCode: '' } })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || { street: '', city: '', country: '', zipCode: '' }
      })
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.put('/user/profile', form)
      const token = localStorage.getItem('token')
      login(token, { ...user, ...data })
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.put('/user/password', passwordForm)
      setMessage('Password updated successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">My Profile</h1>

        {message && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="bg-gray-900 p-6 rounded-xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
              <input
                type="text"
                value={form.name}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Phone</label>
              <input
                type="text"
                value={form.phone}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Street</label>
              <input
                type="text"
                value={form.address.street}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">City</label>
                <input
                  type="text"
                  value={form.address.city}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Country</label>
                <input
                  type="text"
                  value={form.address.country}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
                />
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Zip Code</label>
              <input
                type="text"
                value={form.address.zipCode}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Password Form */}
        <form onSubmit={handlePasswordUpdate} className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default Profile