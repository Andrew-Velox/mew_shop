'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FeaturedSections() {
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const productsRef = useRef([])
  const categoriesRef = useRef([])
  const blogRef = useRef(null)
  const blogTitleRef = useRef(null)
  const blogPostsRef = useRef([])

  // State for categories
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState(null)

  // State for products
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      if (titleRef.current) {
        gsap.set(titleRef.current, { scale: 0, opacity: 0, rotationY: -30 })
      }
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { y: 50, opacity: 0 })
      }
      
      // Set initial states for products
      const validProducts = productsRef.current.filter(item => item !== null)
      if (validProducts.length > 0) {
        gsap.set(validProducts, (index) => ({
          y: 100, 
          x: index % 2 === 0 ? -50 : 50,
          opacity: 0, 
          scale: 0.8, 
          rotationY: index % 2 === 0 ? -20 : 20
        }))
      }

      // Set initial states for categories
      const validCategories = categoriesRef.current.filter(item => item !== null)
      if (validCategories.length > 0) {
        gsap.set(validCategories, { scale: 0, opacity: 0, rotation: 180 })
      }

      // Set initial states for blog section
      if (blogTitleRef.current) {
        gsap.set(blogTitleRef.current, { scale: 0, opacity: 0, rotationX: -45 })
      }
      
      const validBlogPosts = blogPostsRef.current.filter(item => item !== null)
      if (validBlogPosts.length > 0) {
        gsap.set(validBlogPosts, (index) => ({
          y: 150, 
          opacity: 0, 
          scale: 0.7, 
          rotationY: (index % 3 === 0) ? -30 : (index % 3 === 1) ? 30 : 0,
          rotationX: 20
        }))
      }

      // Main entrance animations
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        onEnter: () => {
          console.log('🌱 Eco Products section triggered!')
          
          // Title animation
          if (titleRef.current) {
            gsap.to(titleRef.current, {
              scale: 1,
              opacity: 1,
              rotationY: 0,
              duration: 1.5,
              ease: "elastic.out(1, 0.6)"
            })
          }

          // Subtitle animation
          if (subtitleRef.current) {
            gsap.to(subtitleRef.current, {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              delay: 0.3
            })
          }

          // Categories animation
          if (validCategories.length > 0) {
            gsap.to(validCategories, {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "back.out(1.7)",
              delay: 0.6
            })
          }

          // Products animation
          if (validProducts.length > 0) {
            gsap.to(validProducts, {
              y: 0,
              x: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 1.2,
              stagger: 0.15,
              ease: "back.out(1.7)",
              delay: 0.9
            })
          }
        }
      })

      // Blog Section Animation
      ScrollTrigger.create({
        trigger: blogRef.current,
        start: "top 80%",
        onEnter: () => {
          console.log('📝 Blog section triggered!')
          
          // Blog title animation
          if (blogTitleRef.current) {
            gsap.to(blogTitleRef.current, {
              scale: 1,
              opacity: 1,
              rotationX: 0,
              duration: 1.5,
              ease: "elastic.out(1, 0.6)"
            })
          }

          // Blog posts animation
          if (validBlogPosts.length > 0) {
            gsap.to(validBlogPosts, {
              y: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              rotationX: 0,
              duration: 1.2,
              stagger: 0.2,
              ease: "back.out(1.7)",
              delay: 0.3
            })
          }
        }
      })

      // Hover animations for products
      validProducts.forEach((product, index) => {
        if (product) {
          product.addEventListener('mouseenter', () => {
            gsap.to(product, {
              scale: 1.05,
              y: -15,
              rotationY: index % 2 === 0 ? 8 : -8,
              duration: 0.4,
              ease: "power2.out",
              transformPerspective: 1000
            })
          })
          product.addEventListener('mouseleave', () => {
            gsap.to(product, {
              scale: 1,
              y: 0,
              rotationY: 0,
              duration: 0.4,
              ease: "power2.out"
            })
          })
        }
      })

      // Hover animations for categories
      validCategories.forEach((category) => {
        if (category) {
          category.addEventListener('mouseenter', () => {
            gsap.to(category, {
              scale: 1.1,
              rotation: 5,
              duration: 0.3,
              ease: "power2.out"
            })
          })
          category.addEventListener('mouseleave', () => {
            gsap.to(category, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out"
            })
          })
        }
      })

      // Hover animations for blog posts
      validBlogPosts.forEach((post, index) => {
        if (post) {
          post.addEventListener('mouseenter', () => {
            gsap.to(post, {
              scale: 1.03,
              y: -10,
              rotationY: index % 2 === 0 ? 5 : -5,
              duration: 0.4,
              ease: "power2.out",
              transformPerspective: 1000
            })
          })
          post.addEventListener('mouseleave', () => {
            gsap.to(post, {
              scale: 1,
              y: 0,
              rotationY: 0,
              duration: 0.4,
              ease: "power2.out"
            })
          })
        }
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
        
        console.log('Fetching categories...')
        const response = await fetch('/api/categories')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Categories fetched:', data)
        
        if (Array.isArray(data)) {
          setCategories(data)
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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true)
        setProductsError(null)
        
        console.log('Fetching products...')
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Products fetched:', data)
        
        if (Array.isArray(data)) {
          // Get only featured products or first 6 products
          const featuredProducts = data.filter(product => product.featured).slice(0, 6)
          if (featuredProducts.length === 0) {
            // If no featured products, get first 6
            setProducts(data.slice(0, 6))
          } else {
            setProducts(featuredProducts)
          }
        } else {
          throw new Error('Invalid products data format')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProductsError(error.message)
        // Fallback to empty array on error
        setProducts([])
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Function to get category icon based on name
  const getCategoryIcon = (categoryName) => {
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

  // Products will be fetched from API

  // Function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Other'
  }

  // Categories will be fetched from API

  // Sample blog posts (will be replaced with API data later)
  const sampleBlogs = [
    {
      id: 1,
      title: '10 Ways to Reduce Digital Carbon Footprint',
      excerpt: 'Learn how small changes in your digital habits can make a big difference for the environment.',
      author: 'Sarah Green',
      date: '2024-01-15',
      readTime: '5 min read',
      category: 'Digital Sustainability',
      image: '/placeholder-blog.jpg',
      tags: ['sustainability', 'digital', 'environment']
    },
    {
      id: 2,
      title: 'The Rise of Eco-Friendly Tech Gadgets',
      excerpt: 'Exploring the latest innovations in sustainable technology and green electronics.',
      author: 'Mike Chen',
      date: '2024-01-12',
      readTime: '7 min read',
      category: 'Green Technology',
      image: '/placeholder-blog.jpg',
      tags: ['technology', 'gadgets', 'eco-friendly']
    },
    {
      id: 3,
      title: 'Building a Zero-Waste Digital Lifestyle',
      excerpt: 'Practical tips for minimizing waste in our increasingly digital world.',
      author: 'Emma Wilson',
      date: '2024-01-10',
      readTime: '6 min read',
      category: 'Lifestyle',
      image: '/placeholder-blog.jpg',
      tags: ['zero-waste', 'lifestyle', 'digital']
    },
    {
      id: 4,
      title: 'Renewable Energy for Home Offices',
      excerpt: 'How to power your remote workspace with clean, sustainable energy sources.',
      author: 'David Park',
      date: '2024-01-08',
      readTime: '8 min read',
      category: 'Energy',
      image: '/placeholder-blog.jpg',
      tags: ['renewable', 'energy', 'home-office']
    },
    {
      id: 5,
      title: 'Sustainable Web Design Principles',
      excerpt: 'Creating beautiful, functional websites while minimizing environmental impact.',
      author: 'Lisa Rodriguez',
      date: '2024-01-05',
      readTime: '9 min read',
      category: 'Web Design',
      image: '/placeholder-blog.jpg',
      tags: ['web-design', 'sustainability', 'development']
    },
    {
      id: 6,
      title: 'The Future of Green Computing',
      excerpt: 'Exploring emerging trends in environmentally conscious computing and data centers.',
      author: 'Alex Kim',
      date: '2024-01-03',
      readTime: '10 min read',
      category: 'Computing',
      image: '/placeholder-blog.jpg',
      tags: ['computing', 'future', 'green-tech']
    }
  ]

  const renderEcoRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < rating ? 'text-green-500' : 'text-gray-300'}`}
          >
            🌿
          </span>
        ))}
      </div>
    )
  }

  return (
    <>
      <div 
        ref={containerRef}
        className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 transition-colors duration-300 overflow-hidden relative"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 
              ref={titleRef}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Eco Friendly Products
              </span>
            </h2>
            <p 
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Discover sustainable, environmentally conscious products that make a positive impact on our planet
            </p>
          </div>

          {/* Categories Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Shop by Category
            </h3>
            
            {/* Loading State */}
            {categoriesLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 dark:text-gray-400">Loading categories...</span>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {categoriesError && (
              <div className="flex justify-center items-center py-12">
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
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {categories.map((category, index) => (
                  <Link 
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 min-w-[140px] sm:min-w-[160px] block"
                    ref={el => categoriesRef.current[index] = el}
                  >
                    <div className="text-center">
                      {/* Category Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
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
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                        {category.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        View products
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Empty State */}
            {!categoriesLoading && !categoriesError && categories.length === 0 && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="text-6xl mb-4 opacity-50">📂</div>
                  <p className="text-gray-600 dark:text-gray-400">No categories available at the moment</p>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="mb-16">
            {/* Loading State */}
            {productsLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 dark:text-gray-400">Loading products...</span>
                </div>
              </div>
            )}
            
            {/* Error State */}
            {productsError && (
              <div className="flex justify-center items-center py-12">
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-6 py-4 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <span>❌</span>
                    <span>Failed to load products: {productsError}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Products Grid */}
            {!productsLoading && !productsError && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    ref={el => productsRef.current[index] = el}
                    className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 cursor-pointer transform-gpu"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl opacity-20">
                          📦
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {product.featured ? 'FEATURED' : 'NEW'}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-400"></div>
                    </div>

                    {/* Product Content */}
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium">
                          {getCategoryName(product.category)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${product.price}
                          </span>
                        </div>
                        
                        <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-sm">
                          Add to Cart
                        </button>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center text-sm text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
                        >
                          View Details
                          <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Empty State */}
            {!productsLoading && !productsError && products.length === 0 && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="text-6xl mb-4 opacity-50">📦</div>
                  <p className="text-gray-600 dark:text-gray-400">No products available at the moment</p>
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg group"
            >
              View all Sustainable Products
              <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Sustainable Digital Living Blog Section */}
      <div 
        ref={blogRef}
        className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-700 dark:to-indigo-900 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Blog Header */}
          <div className="text-center mb-16">
            <h2 
              ref={blogTitleRef}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Sustainable Digital Living Blog
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Insights, tips, and innovations for a more sustainable digital future
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {sampleBlogs.map((blog, index) => (
              <article
                key={blog.id}
                ref={el => blogPostsRef.current[index] = el}
                className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 cursor-pointer transform-gpu"
              >
                {/* Blog Image */}
                <div className="relative h-48 sm:h-52 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                    📝
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {blog.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-medium">
                    {blog.readTime}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/blog/${blog.id}`}
                      className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      Read More
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Blog CTA */}
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl text-lg group"
            >
              View All Blog Posts
              <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
