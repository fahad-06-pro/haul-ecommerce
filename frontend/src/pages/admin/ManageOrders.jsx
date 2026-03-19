import { useState, useEffect } from 'react'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'

const statusColors = {
  processing: 'text-yellow-400',
  shipped: 'text-blue-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
}

const ManageOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders')
      setOrders(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: status })
      fetchOrders()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Manage Orders ({orders.length})</h1>

        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-900 p-6 rounded-xl">

              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="text-sm font-mono">{order._id}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {order.user?.name} — {order.user?.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={order.orderStatus}
                    className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm outline-none"
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <span className={`text-sm font-semibold capitalize ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Products */}
              <div className="flex flex-col gap-2 mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Products</p>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-400">
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span className="text-white">${item.price}</span>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Shipping Address</p>
                <div className="text-sm text-white flex flex-col gap-1">
                  <p>📍 {order.shippingAddress?.street}</p>
                  <p>🏙️ {order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                  <p>📮 Zip: {order.shippingAddress?.zipCode}</p>
                </div>
              </div>

              {/* Payment + Total */}
              <div className="flex justify-between text-sm border-t border-gray-800 pt-3">
                <div>
                  <p className="text-xs text-gray-400">Payment</p>
                  <p className="text-white capitalize">{order.paymentMethod}</p>
                  <p className={`text-xs mt-1 ${order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {order.paymentStatus}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-green-400 font-semibold text-lg">${order.totalPrice?.toFixed(2)}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ManageOrders