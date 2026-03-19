import { useState, useEffect } from 'react'
import API from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'

const statusColors = {
  processing: 'text-yellow-400',
  shipped: 'text-blue-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my')
      setOrders(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">My Orders ({orders.length})</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No orders yet!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-900 p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="text-sm font-mono text-white">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold capitalize ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.product?.images?.[0] || 'https://via.placeholder.com/50'}
                        alt={item.product?.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.product?.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-green-400 text-sm">${item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Payment</p>
                    <p className="text-sm capitalize">{order.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-green-400 font-semibold">${order.totalPrice?.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Orders