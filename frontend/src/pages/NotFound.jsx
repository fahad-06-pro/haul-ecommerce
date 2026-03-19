import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-8xl font-bold text-green-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound