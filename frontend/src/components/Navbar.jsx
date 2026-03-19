import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const cartCount = cart?.items?.length || 0

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-400 tracking-tight">
          Haul
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-white transition text-sm">Home</Link>
          <Link to="/products" className="text-gray-300 hover:text-white transition text-sm">Products</Link>
          {user && (
            <>
              <Link to="/wishlist" className="text-gray-300 hover:text-white transition text-sm">Wishlist</Link>
              <Link to="/orders" className="text-gray-300 hover:text-white transition text-sm">Orders</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 transition text-sm">Admin</Link>
          )}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative text-gray-300 hover:text-white transition">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-sm text-gray-300 hover:text-white transition">
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-300 hover:text-white transition">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg transition">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 flex flex-col gap-4">
          <Link to="/" className="text-gray-300 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="text-gray-300 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/cart" className="text-gray-300 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Cart ({cartCount})</Link>
          {user && (
            <>
              <Link to="/wishlist" className="text-gray-300 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Wishlist</Link>
              <Link to="/orders" className="text-gray-300 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Orders</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>{user.name}</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-yellow-400 text-sm" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="bg-red-500 text-white text-sm px-3 py-2 rounded-lg">Logout</button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-gray-300 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="bg-green-500 text-white text-sm px-3 py-1.5 rounded-lg" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar