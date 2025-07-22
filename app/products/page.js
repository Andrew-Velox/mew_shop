'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Products() {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const searchRef = useRef(null)
  const categoriesRef = useRef([])
  const productsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )

      // Search bar animation
      gsap.fromTo(searchRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.3 }
      )

      // Categories animation with stagger
      gsap.fromTo(categoriesRef.current,
        { y: 30, opacity: 0, rotateX: 45 },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
          duration: 0.6, 
          stagger: 0.1, 
          ease: "back.out(1.7)",
          delay: 0.5
        }
      )

      // Products grid scroll animation
      ScrollTrigger.batch(productsRef.current, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { y: 100, opacity: 0, scale: 0.8 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 0.8, 
              stagger: 0.1, 
              ease: "back.out(1.7)" 
            }
          )
        },
        start: "top 85%",
        refreshPriority: -1
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const categories = [
    { name: 'All Products', icon: '🛍️', count: '500+' },
    { name: 'Electronics', icon: '📱', count: '150+' },
    { name: 'Home & Garden', icon: '🏡', count: '120+' },
    { name: 'Fashion', icon: '👕', count: '90+' },
    { name: 'Books', icon: '📚', count: '140+' }
  ]

  const featuredProducts = [
    { 
      id: 1, 
      name: 'Eco-Friendly Laptop Stand', 
      price: '$49.99', 
      image: '/api/placeholder/300/250',
      rating: 4.8,
      category: 'Electronics'
    },
    { 
      id: 2, 
      name: 'Sustainable Coffee Maker', 
      price: '$89.99', 
      image: '/api/placeholder/300/250',
      rating: 4.6,
      category: 'Home & Garden'
    },
    { 
      id: 3, 
      name: 'Organic Cotton T-Shirt', 
      price: '$24.99', 
      image: '/api/placeholder/300/250',
      rating: 4.9,
      category: 'Fashion'
    },
    { 
      id: 4, 
      name: 'Solar Phone Charger', 
      price: '$34.99', 
      image: '/api/placeholder/300/250',
      rating: 4.7,
      category: 'Electronics'
    },
    { 
      id: 5, 
      name: 'Bamboo Kitchen Set', 
      price: '$59.99', 
      image: '/api/placeholder/300/250',
      rating: 4.8,
      category: 'Home & Garden'
    },
    { 
      id: 6, 
      name: 'Recycled Notebook', 
      price: '$12.99', 
      image: '/api/placeholder/300/250',
      rating: 4.5,
      category: 'Books'
    }
  ]

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900"
    >
      {/* Header */}
      <div 
        ref={headerRef}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-16 border-b border-green-100 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Sustainable{' '}
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover eco-friendly products that make a positive impact on our planet
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div 
          ref={searchRef}
          className="mb-8 max-w-md mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 rounded-full border border-green-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600">
              🔍
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={category.name}
              ref={(el) => {
                if (el && !categoriesRef.current.includes(el)) {
                  categoriesRef.current[index] = el
                }
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 dark:border-gray-700 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                {category.count}
              </p>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                if (el && !productsRef.current.includes(el)) {
                  productsRef.current[index] = el
                }
              }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 dark:border-gray-700 group"
            >
              <div className="relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <span className="text-4xl">{product.category === 'Electronics' ? '📱' : product.category === 'Home & Garden' ? '🏡' : product.category === 'Fashion' ? '👕' : '📚'}</span>
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Eco-Friendly
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.rating}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {product.price}
                  </span>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors duration-300 transform hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
