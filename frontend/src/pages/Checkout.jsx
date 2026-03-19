import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')

  const [form, setForm] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    country: user?.address?.country || '',
    zipCode: user?.address?.zipCode || '',
    paymentMethod: 'cod',
  })

  const shippingCost = cart.totalPrice >= 100 ? 0 : 10
  const finalTotal = (cart.totalPrice - discount + shippingCost).toFixed(2)

  const applyCoupon = async () => {
    try {
      const { data } = await API.post('/coupons/apply', {
        code: couponCode,
        orderAmount: cart.totalPrice,
      })
      setDiscount(data.discount)
      setCouponMsg(data.message)
    } catch (err) {
      setCouponMsg(err.response?.data?.message || 'Invalid coupon')
      setDiscount(0)
    }
  }

  const handleOrder = async () => {
    setLoading(true)
    try {
      await API.post('/orders', {
        shippingAddress: {
          street: form.street,
          city: form.city,
          country: form.country,
          zipCode: form.zipCode,
        },
        paymentMethod: form.paymentMethod,
        couponDiscount: discount,
      })
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Shipping Form */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Street"
                value={form.street}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                value={form.city}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Country"
                value={form.country}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={form.zipCode}
                className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
              />

              {/* Payment Method */}
              <h2 className="text-lg font-semibold mt-2">Payment Method</h2>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    value="cod"
                    checked={form.paymentMethod === 'cod'}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="accent-green-500"
                  />
                  <span className="text-sm">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    value="stripe"
                    checked={form.paymentMethod === 'stripe'}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="accent-green-500"
                  />
                  <span className="text-sm">Credit / Debit Card (Stripe)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-900 p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="flex flex-col gap-3">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-400">
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t border-gray-800 pt-3 flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${cart.totalPrice?.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-400">Free</span>
                  ) : (
                    <span className="text-white">${shippingCost}</span>
                  )}
                </div>
                {shippingCost === 0 ? (
                  <p className="text-xs text-green-400">🎉 You got free shipping!</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Add ${(100 - cart.totalPrice).toFixed(2)} more for free shipping
                  </p>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-green-400">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-semibold text-white border-t border-gray-800 pt-3">
                  <span>Total</span>
                  <span className="text-green-400">${finalTotal}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-gray-900 p-6 rounded-xl">
              <h2 className="text-lg font-semibold mb-4">Coupon Code</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon"
                  value={couponCode}
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  onClick={applyCoupon}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-sm transition"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-sm mt-2 ${discount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {couponMsg}
                </p>
              )}
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white font-semibold py-4 rounded-xl transition"
            >
              {loading ? 'Placing Order...' : `Place Order — $${finalTotal}`}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Checkout