import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Loader from '../../components/Loader'

const Dashboard = () => {
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        API.get('/orders'),
        API.get('/products'),
      ])

      const orders = ordersRes.data
      const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0)

      setStats({
        orders: orders.length,
        products: productsRes.data.total,
        revenue: revenue.toFixed(2),
      })
      setRecentOrders(orders.slice(0, 5))
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
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Orders', value: stats.orders, color: 'text-blue-400' },
            { label: 'Total Products', value: stats.products, color: 'text-green-400' },
            { label: 'Total Revenue', value: `$${stats.revenue}`, color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 p-6 rounded-xl">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Manage Products', path: '/admin/products', color: 'bg-green-500' },
            { label: 'Manage Orders', path: '/admin/orders', color: 'bg-blue-500' },
            { label: 'Manage Categories', path: '/admin/categories', color: 'bg-yellow-500' },
            { label: 'Manage Coupons', path: '/admin/coupons', color: 'bg-purple-500' },
          ].map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className={`${link.color} hover:opacity-90 text-white font-semibold px-4 py-4 rounded-xl text-center transition text-sm`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex justify-between items-center text-sm border-b border-gray-800 pb-3">
                <p className="text-gray-400 font-mono truncate w-40">{order._id}</p>
                <p className="text-white">{order.user?.name}</p>
                <p className="text-green-400">${order.totalPrice?.toFixed(2)}</p>
                <p className="capitalize text-yellow-400">{order.orderStatus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard