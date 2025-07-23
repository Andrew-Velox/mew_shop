'use client'

import { useEffect, useRef, useState } from 'react'
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

  // State for categories
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(null)

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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        setCategoriesError(null)
        
        console.log('Fetching categories for products page...')
        const response = await fetch('/api/categories')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Categories fetched for products page:', data)
        
        if (Array.isArray(data)) {
          // Add "All Products" as first category
          const allProductsCategory = {
            id: 0,
            name: 'All Products',
            slug: 'all',
            image: null
          }
          setCategories([allProductsCategory, ...data])
        } else {
          throw new Error('Invalid categories data format')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategoriesError(error.message)
        // Fallback to empty array on error
        setCategories([])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Function to get category icon based on name
  const getCategoryIcon = (categoryName) => {
    if (categoryName === 'All Products') return '🛍️'
    
    const name = categoryName.toLowerCase()
    if (name.includes('food') || name.includes('restaurant') || name.includes('dining')) return '🍽️'
    if (name.includes('electronics') || name.includes('tech') || name.includes('gadget')) return '⚡'
    if (name.includes('fashion') || name.includes('clothing') || name.includes('apparel')) return '👕'
    if (name.includes('home') || name.includes('garden') || name.includes('house')) return '🏠'
    if (name.includes('fitness') || name.includes('sport') || name.includes('gym')) return '💪'
    if (name.includes('book') || name.includes('education') || name.includes('learning')) return '📚'
    if (name.includes('beauty') || name.includes('cosmetic') || name.includes('skincare')) return '💄'
    if (name.includes('toy') || name.includes('game') || name.includes('kid')) return '🎮'
    if (name.includes('auto') || name.includes('car') || name.includes('vehicle')) return '🚗'
    if (name.includes('health') || name.includes('medical') || name.includes('pharmacy')) return '⚕️'
    if (name.includes('pet') || name.includes('animal')) return '🐾'
    if (name.includes('travel') || name.includes('vacation') || name.includes('trip')) return '✈️'
    if (name.includes('music') || name.includes('instrument') || name.includes('audio')) return '🎵'
    if (name.includes('art') || name.includes('craft') || name.includes('creative')) return '🎨'
    // Default icon
    return '🏷️'
  }

  // Categories will be fetched from API

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
        <div className="mb-12">
          {/* Loading State */}
          {categoriesLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading categories...</span>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {categoriesError && (
            <div className="flex justify-center items-center py-8">
              <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-6 py-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <span>❌</span>
                  <span>Failed to load categories: {categoriesError}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Categories Grid */}
          {!categoriesLoading && !categoriesError && categories.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <button
                  key={category.id || category.name}
                  ref={(el) => {
                    if (el && !categoriesRef.current.includes(el)) {
                      categoriesRef.current[index] = el
                    }
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 dark:border-gray-700 group"
                >
                  <div className="mb-3">
                    {category.image ? (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto group-hover:scale-110 transition-transform duration-300">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback to emoji icon if image fails to load
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        {/* Fallback emoji icon */}
                        <div 
                          className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl"
                          style={{ display: 'none' }}
                        >
                          {getCategoryIcon(category.name)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                        {getCategoryIcon(category.name)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                    {category.name === 'All Products' ? 'View All' : 'Filter'}
                  </p>
                </button>
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!categoriesLoading && !categoriesError && categories.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="text-4xl mb-4 opacity-50">📂</div>
                <p className="text-gray-600 dark:text-gray-400">No categories available</p>
              </div>
            </div>
          )}
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
