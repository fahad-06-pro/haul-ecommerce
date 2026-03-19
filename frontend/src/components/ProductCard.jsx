import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toggleWishlist, isWishlisted } = useWishlist()

  const wishlisted = isWishlisted(product._id)

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-green-900/20 transition group">
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden h-52">
          <img
            src={product.images[0] || 'https://placehold.co/300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {discountPercent && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              -{discountPercent}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-white font-semibold truncate hover:text-green-400 transition">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm mt-1">{product.category?.name}</p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-green-400 font-bold">
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-gray-500 text-sm line-through">${product.price}</span>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => addToCart(product._id)}
            disabled={product.stock === 0}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm py-2 rounded-lg transition"
          >
            Add to Cart
          </button>
          {user && (
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`px-3 py-2 rounded-lg transition text-lg ${
                wishlisted
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              {wishlisted ? '♥' : '♡'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard