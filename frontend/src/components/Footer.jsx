import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-3">Haul</h2>
            <p className="text-gray-400 text-sm">
              Your go-to store for everything trendy. Shop the latest drops.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition">Home</Link>
              <Link to="/products" className="text-gray-400 hover:text-white text-sm transition">Products</Link>
              <Link to="/cart" className="text-gray-400 hover:text-white text-sm transition">Cart</Link>
              <Link to="/orders" className="text-gray-400 hover:text-white text-sm transition">Orders</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-3">Account</h3>
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">Login</Link>
              <Link to="/register" className="text-gray-400 hover:text-white text-sm transition">Register</Link>
              <Link to="/profile" className="text-gray-400 hover:text-white text-sm transition">Profile</Link>
              <Link to="/wishlist" className="text-gray-400 hover:text-white text-sm transition">Wishlist</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">© 2026 Haul. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer