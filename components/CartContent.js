'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon, 
  ShoppingBagIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline'

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/150'
  if (imagePath.startsWith('http')) return imagePath
  // Use production Django backend URL
  const baseUrl = 'https://shopdrf-production.up.railway.app'
  return `${baseUrl}${imagePath}`
}

export default function CartContent() {
  const containerRef = useRef(null)
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [cartCode, setCartCode] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
    
    // Stop loading if not authenticated
    if (!token) {
      setLoading(false)
    }
  }, [])

  // Get or create cart code
  useEffect(() => {
    if (!isAuthenticated) return
    
    let code = localStorage.getItem('cart_code')
    if (!code) {
      code = 'CART_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('cart_code', code)
    }
    setCartCode(code)
  }, [isAuthenticated])

  // Fetch cart data
  useEffect(() => {
    if (!cartCode) return

    const fetchCart = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/cart?cart_code=${cartCode}`)
        const data = await response.json()
        setCart(data)
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [cartCode])

  // Animation
  useEffect(() => {
    if (!loading && cart) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.cart-item',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        )
      }, containerRef)
      return () => ctx.revert()
    }
  }, [loading, cart])

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    setUpdating(true)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      })

      if (response.ok) {
        // Refresh cart
        const cartResponse = await fetch(`/api/cart?cart_code=${cartCode}`)
        const updatedCart = await cartResponse.json()
        setCart(updatedCart)
        // Dispatch cart update event
        window.dispatchEvent(new Event('cartUpdated'))
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (itemId) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh cart
        const cartResponse = await fetch(`/api/cart?cart_code=${cartCode}`)
        const updatedCart = await cartResponse.json()
        setCart(updatedCart)
        // Dispatch cart update event
        window.dispatchEvent(new Event('cartUpdated'))
      }
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setUpdating(false)
    }
  }

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return
    
    setUpdating(true)
    try {
      const response = await fetch(`/api/cart/clear/${cartCode}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCart({ cartitems: [], cart_total: 0, total_items: 0 })
        // Dispatch cart update event
        window.dispatchEvent(new Event('cartUpdated'))
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
          <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view cart</h2>
          <p className="text-gray-600 mb-6">Create an account or sign in to manage your shopping cart</p>
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

  const isEmpty = !cart?.cartitems || cart.cartitems.length === 0

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
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          {!isEmpty && (
            <p className="text-gray-600 mt-2">
              You have {cart.total_items} item{cart.total_items !== 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>

        {isEmpty ? (
          /* Empty Cart */
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link
              href="/products"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.cartitems.map((item) => (
                <div
                  key={item.id}
                  className="cart-item bg-white rounded-2xl shadow-lg p-6 flex gap-6 items-center"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link 
                      href={`/products/${item.product.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-green-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600 mt-1">${parseFloat(item.product.price).toFixed(2)} each</p>
                    <p className="text-green-600 font-semibold mt-2">
                      Subtotal: ${parseFloat(item.sub_total).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                      className="p-3 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <MinusIcon className="w-5 h-5 stroke-2" />
                    </button>
                    <span className="w-16 text-center font-bold text-xl text-gray-900 bg-gray-100 py-2 rounded-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updating}
                      className="p-3 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-bold disabled:opacity-50 transition-colors"
                    >
                      <PlusIcon className="w-5 h-5 stroke-2" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={updating}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <TrashIcon className="w-6 h-6 stroke-2" />
                  </button>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                disabled={updating}
                className="text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
              >
                Clear All Items
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cart.total_items})</span>
                    <span>${parseFloat(cart.cart_total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${parseFloat(cart.cart_total).toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-4 rounded-full font-semibold hover:bg-green-700 transition-colors mb-4">
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="block text-center text-green-600 hover:text-green-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
