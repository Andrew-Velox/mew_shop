'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  ArrowLeftIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon 
} from '@heroicons/react/24/solid'

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/600'
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = 'http://127.0.0.1:8000'
  return `${baseUrl}${imagePath}`
}

export default function ProductDetailContent({ productId }) {
  const containerRef = useRef(null)
  const router = useRouter()

  // State management
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [cartCode, setCartCode] = useState(null)

  // Check authentication and init cart
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
    
    let code = localStorage.getItem('cart_code')
    if (!code) {
      code = 'CART_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('cart_code', code)
    }
    setCartCode(code)
  }, [])

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Check if product is in wishlist
  useEffect(() => {
    if (!isAuthenticated || !productId) return

    const checkWishlist = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch(`/api/wishlist/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setIsWishlisted(data.in_wishlist)
        }
      } catch (error) {
        console.error('Error checking wishlist:', error)
      }
    }

    checkWishlist()
  }, [isAuthenticated, productId])

  // Animation
  useEffect(() => {
    if (!loading && product) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.product-detail',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, product])

  // Add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to your cart')
      router.push('/login')
      return
    }
    
    if (!cartCode) return
    
    setAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_code: cartCode,
          product_id: productId,
          quantity: quantity
        })
      })

      if (response.ok) {
        alert(`${quantity} x ${product.name} added to cart!`)
        // Dispatch cart update event
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        alert('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  // Toggle wishlist
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to add to wishlist')
      router.push('/login')
      return
    }

    const token = localStorage.getItem('authToken')

    try {
      if (isWishlisted) {
        const response = await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          setIsWishlisted(false)
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: productId })
        })
        if (response.ok) {
          setIsWishlisted(true)
        } else if (response.status === 401) {
          alert('Your session has expired. Please log in again.')
          router.push('/login')
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      alert('Failed to update wishlist')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/products" 
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Products
        </Link>

        {/* Product Detail */}
        <div className="product-detail bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative bg-gray-100">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600?text=No+Image'
                }}
              />
              {product.featured && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                  FEATURED
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8">
              {/* Category */}
              <div className="text-green-600 font-medium mb-2">
                {product.category?.name || 'Product'}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating (placeholder) */}
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">(Reviews coming soon)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-green-600">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-900 font-bold"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-16 text-center text-gray-900 bg-gray-100 py-2 rounded-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-900 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-green-600 text-white py-4 rounded-full font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="px-6 py-4 border-2 border-green-600 rounded-full hover:bg-green-50 transition-colors"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-green-600" />
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Category: {product.category?.name || 'General'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {product.featured ? 'Featured Product' : 'Regular Product'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Free Shipping Available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
