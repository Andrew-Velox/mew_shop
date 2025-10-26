'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  HeartIcon as HeartSolidIcon,
  ShoppingCartIcon,
  TrashIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/400'
  if (imagePath.startsWith('http')) return imagePath
  // Use production Django backend URL
  const baseUrl = 'https://shopdrf-production.up.railway.app'
  return `${baseUrl}${imagePath}`
}

export default function WishlistContent() {
  const containerRef = useRef(null)
  const router = useRouter()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [addingToCart, setAddingToCart] = useState({})

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
    if (!token) {
      setLoading(false)
    }
  }, [])

  // Fetch wishlist
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchWishlist = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('authToken')
        const response = await fetch('/api/wishlist', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setWishlist(data)
        } else if (response.status === 401) {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [isAuthenticated])

  // Animation
  useEffect(() => {
    if (!loading && wishlist.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.wishlist-item',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, wishlist])

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.product.id !== productId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const addToCart = async (productId) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }))
    
    try {
      let cartCode = localStorage.getItem('cart_code')
      if (!cartCode) {
        cartCode = 'CART_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('cart_code', cartCode)
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_code: cartCode,
          product_id: productId,
          quantity: 1
        })
      })

      if (response.ok) {
        // Show success feedback
        alert('Product added to cart!')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
          <HeartOutlineIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view wishlist</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to save your favorite products</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full hover:bg-gray-300 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  const isEmpty = wishlist.length === 0

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/products" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          {!isEmpty && (
            <p className="text-gray-600 mt-2">
              You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
            </p>
          )}
        </div>

        {isEmpty ? (
          /* Empty Wishlist */
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <HeartOutlineIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love!</p>
            <Link
              href="/products"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="wishlist-item bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <Link href={`/products/${item.product.id}`}>
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400?text=No+Image'
                      }}
                    />
                  </Link>
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <Link 
                    href={`/products/${item.product.id}`}
                    className="block"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  {item.product.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {item.product.description}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </span>
                    
                    <button
                      onClick={() => addToCart(item.product.id)}
                      disabled={addingToCart[item.product.id]}
                      className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add to cart"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
