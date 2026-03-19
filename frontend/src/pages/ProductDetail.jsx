import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ProductCard from '../components/ProductCard'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data } = await API.get(`/products/${id}`)
      setProduct(data)
      const [relatedRes, reviewsRes] = await Promise.all([
        API.get(`/products/related/${id}`),
        API.get(`/reviews/${id}`)
      ])
      setRelated(relatedRes.data)
      setReviews(reviewsRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddReview = async (e) => {
    e.preventDefault()
    try {
      await API.post(`/reviews/${id}`, reviewForm)
      fetchProduct()
      setReviewForm({ rating: 5, comment: '' })
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <Loader />
  if (!product) return <div className="text-white text-center py-20">Product not found</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="bg-gray-900 rounded-xl overflow-hidden h-80 mb-4">
              <img
                src={product.images[activeImage] || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer ${activeImage === i ? 'ring-2 ring-green-500' : 'opacity-60'}`}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-green-400 text-sm mb-2">{product.category?.name}</p>
            <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">★ {product.ratings}</span>
              <span className="text-gray-400 text-sm">({product.numReviews} reviews)</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-green-400">${product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <span className="text-gray-500 line-through text-lg">${product.price}</span>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-6">{product.description}</p>
            <p className="text-sm mb-4">
              Stock: <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-white">-</button>
                <span className="w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="text-gray-400 hover:text-white">+</button>
              </div>
              <button
                onClick={() => addToCart(product._id, quantity)}
                disabled={product.stock === 0}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="text-xl font-bold mb-6">Reviews ({reviews.length})</h2>

          {user && (
            <form onSubmit={handleAddReview} className="bg-gray-900 p-6 rounded-xl mb-6">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="flex flex-col gap-4">
                <select
                  value={reviewForm.rating}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none text-sm"
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{'★'.repeat(r)} {r} stars</option>)}
                </select>
                <textarea
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  required
                  rows={3}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition text-sm">
                  Submit Review
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gray-900 p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white font-semibold">{review.user?.name}</span>
                  <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-400 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default ProductDetail