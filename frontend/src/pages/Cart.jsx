import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Cart = () => {
  const { cart, updateCart, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">Your cart is empty!</p>
          <Link to="/products" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition">
            Shop Now
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">My Cart ({cart.items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-gray-900 p-5 rounded-xl flex gap-4 items-center">
                <img
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-green-400 text-sm mt-1">${item.price}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                  <button
                    onClick={() => updateCart(item.product._id, Math.max(1, item.quantity - 1))}
                    className="text-gray-400 hover:text-white"
                  >-</button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateCart(item.product._id, item.quantity + 1)}
                    className="text-gray-400 hover:text-white"
                  >+</button>
                </div>
                <p className="text-white font-semibold w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-400 hover:text-red-500 text-sm transition"
                >✕</button>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-500 text-sm self-start transition"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900 p-6 rounded-xl h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${cart.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex justify-between text-white font-semibold">
                <span>Total</span>
                <span>${cart.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg mt-6 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Cart