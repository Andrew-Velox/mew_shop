'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, StarIcon, ShareIcon, ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ProductDetailContent({ productId }) {
  const containerRef = useRef(null)
  const imageGalleryRef = useRef(null)
  const productInfoRef = useRef(null)
  const reviewsRef = useRef(null)
  const relatedProductsRef = useRef([])

  // State management
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showImageZoom, setShowImageZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])

  // Mock product data with enhanced details (this would normally come from API)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Dynamic product database - create different products based on ID
        const productDatabase = {
          1: {
            id: 1,
            name: "Premium Organic Pizza",
            description: "Handcrafted artisan pizza made with locally sourced organic ingredients. Our signature dough is fermented for 48 hours to achieve the perfect texture and flavor.",
            longDescription: "Experience the finest in sustainable dining with our Premium Organic Pizza. Each pizza is carefully crafted by our master chefs using only the highest quality organic ingredients sourced from local farms.",
            price: 12.00,
            originalPrice: 15.00,
            discount: 20,
            category: "Food",
            featured: true,
            inStock: true,
            stockCount: 15,
            rating: 4.8,
            reviewCount: 124,
            images: [
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            ],
            sizes: ["Small", "Medium", "Large", "Extra Large"],
            colors: ["Classic", "Whole Wheat", "Gluten-Free"],
            features: ["100% Organic Ingredients", "Locally Sourced", "48-hour Fermented Dough"],
            specifications: {
              "Preparation Time": "15-20 minutes",
              "Serving Size": "2-3 people",
              "Calories": "280 per slice"
            },
            tags: ["Organic", "Vegetarian", "Local", "Artisan"]
          },
          2: {
            id: 2,
            name: "Organic Caesar Salad",
            description: "Fresh organic romaine lettuce with house-made caesar dressing, parmesan cheese, and artisan croutons.",
            longDescription: "Our signature Caesar Salad features crisp organic romaine lettuce, aged parmesan cheese, and our secret-recipe caesar dressing made fresh daily.",
            price: 8.50,
            originalPrice: 10.00,
            discount: 15,
            category: "Food",
            featured: false,
            inStock: true,
            stockCount: 25,
            rating: 4.7,
            reviewCount: 89,
            images: [
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
              "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            ],
            sizes: ["Regular", "Large"],
            colors: ["Original", "Extra Parmesan", "Light Dressing"],
            features: ["Organic Lettuce", "Fresh Daily Dressing", "Artisan Croutons"],
            specifications: {
              "Preparation Time": "5-8 minutes",
              "Serving Size": "1 person",
              "Calories": "220 per serving"
            },
            tags: ["Organic", "Vegetarian", "Fresh", "Healthy"]
          },
          3: {
            id: 3,
            name: "Artisan Breadsticks",
            description: "Warm, golden breadsticks baked fresh daily with herbs and garlic. Perfect for sharing or as a side dish.",
            longDescription: "Our artisan breadsticks are made from scratch using traditional techniques. Each batch is hand-rolled and baked to golden perfection with our signature herb blend.",
            price: 6.00,
            originalPrice: 8.00,
            discount: 25,
            category: "Food",
            featured: false,
            inStock: true,
            stockCount: 30,
            rating: 4.6,
            reviewCount: 67,
            images: [
              "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
              "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            ],
            sizes: ["6 pieces", "12 pieces"],
            colors: ["Classic", "Garlic Herb", "Sesame"],
            features: ["Fresh Baked Daily", "Hand-rolled", "Signature Herbs"],
            specifications: {
              "Preparation Time": "10-12 minutes",
              "Serving Size": "2-4 people",
              "Calories": "150 per piece"
            },
            tags: ["Fresh", "Artisan", "Vegetarian", "Warm"]
          },
          4: {
            id: 4,
            name: "Organic Pasta Primavera",
            description: "Fresh organic pasta tossed with seasonal vegetables in a light cream sauce. Made with locally sourced ingredients.",
            longDescription: "Our Pasta Primavera celebrates the season's best vegetables, combined with our house-made organic pasta and a delicate cream sauce that enhances natural flavors.",
            price: 14.00,
            originalPrice: 16.50,
            discount: 15,
            category: "Food",
            featured: true,
            inStock: true,
            stockCount: 18,
            rating: 4.9,
            reviewCount: 156,
            images: [
              "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
              "https://images.unsplash.com/photo-1563379091339-03246963d51a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            ],
            sizes: ["Regular", "Large"],
            colors: ["Original", "Whole Wheat", "Gluten-Free"],
            features: ["Organic Pasta", "Seasonal Vegetables", "House-made Sauce"],
            specifications: {
              "Preparation Time": "12-15 minutes",
              "Serving Size": "1-2 people",
              "Calories": "420 per serving"
            },
            tags: ["Organic", "Vegetarian", "Fresh", "Seasonal"]
          },
          5: {
            id: 5,
            name: "Gourmet Burger",
            description: "Premium grass-fed beef patty with fresh lettuce, tomatoes, and our signature sauce on a brioche bun.",
            longDescription: "Our gourmet burger features the finest grass-fed beef, locally sourced vegetables, and a brioche bun baked fresh daily in our kitchen.",
            price: 16.50,
            originalPrice: 19.00,
            discount: 13,
            category: "Food",
            featured: true,
            inStock: true,
            stockCount: 22,
            rating: 4.8,
            reviewCount: 203,
            images: [
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
              "https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            ],
            sizes: ["Regular", "Double"],
            colors: ["Classic", "BBQ", "Spicy"],
            features: ["Grass-fed Beef", "Fresh Brioche Bun", "Signature Sauce"],
            specifications: {
              "Preparation Time": "15-18 minutes",
              "Serving Size": "1 person",
              "Calories": "650 per burger"
            },
            tags: ["Premium", "Fresh", "Signature", "Gourmet"]
          },
          6: {
            id: 6,
            name: "Fresh Sushi Roll",
            description: "Premium sushi roll with fresh salmon, avocado, and cucumber, served with wasabi and pickled ginger.",
            longDescription: "Our sushi rolls are prepared by skilled chefs using the freshest fish and ingredients. Each roll is made to order ensuring optimal quality and taste.",
            price: 18.00,
            originalPrice: 22.00,
            discount: 18,
            category: "Food",
            featured: true,
            inStock: true,
            stockCount: 12,
            rating: 4.9,
            reviewCount: 98,
            images: [
              "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
              "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            ],
            sizes: ["6 pieces", "8 pieces", "12 pieces"],
            colors: ["Salmon", "Tuna", "Vegetarian"],
            features: ["Fresh Fish Daily", "Made to Order", "Traditional Recipe"],
            specifications: {
              "Preparation Time": "10-15 minutes",
              "Serving Size": "1-2 people",
              "Calories": "180 per piece"
            },
            tags: ["Fresh", "Premium", "Traditional", "Healthy"]
          }
        }

        // Get the specific product or fallback to default
        const mockProduct = productDatabase[productId] || productDatabase[1]

        // Generate dynamic reviews based on product
        const reviewsDatabase = {
          1: [ // Pizza reviews
            { id: 1, user: "Sarah M.", rating: 5, date: "2 days ago", comment: "Absolutely amazing! The best pizza I've had in years. You can really taste the quality of the organic ingredients.", verified: true },
            { id: 2, user: "Mike R.", rating: 4, date: "1 week ago", comment: "Great flavor and perfect crust. Love that it's organic and locally sourced. Will definitely order again!", verified: true },
            { id: 3, user: "Emma L.", rating: 5, date: "2 weeks ago", comment: "The 48-hour fermented dough makes all the difference. So much flavor and perfectly digestible.", verified: false }
          ],
          2: [ // Caesar Salad reviews
            { id: 1, user: "Lisa K.", rating: 5, date: "1 day ago", comment: "Fresh and crispy lettuce with perfect caesar dressing. The parmesan is so flavorful!", verified: true },
            { id: 2, user: "John D.", rating: 4, date: "3 days ago", comment: "Great salad! Love the organic ingredients. Perfect portion size for lunch.", verified: true },
            { id: 3, user: "Maria S.", rating: 5, date: "1 week ago", comment: "Best caesar salad in town. The croutons add the perfect crunch.", verified: true }
          ],
          3: [ // Breadsticks reviews
            { id: 1, user: "Tom W.", rating: 5, date: "2 days ago", comment: "Warm and fluffy with amazing herb flavor. Perfect for sharing!", verified: true },
            { id: 2, user: "Anna P.", rating: 4, date: "5 days ago", comment: "Really good breadsticks. The garlic herb flavor is my favorite.", verified: false },
            { id: 3, user: "Chris H.", rating: 5, date: "1 week ago", comment: "Fresh baked and delicious. Great as an appetizer or side dish.", verified: true }
          ],
          4: [ // Pasta reviews
            { id: 1, user: "Sophie B.", rating: 5, date: "1 day ago", comment: "The pasta is perfectly cooked and the vegetables are so fresh. Absolutely delicious!", verified: true },
            { id: 2, user: "David L.", rating: 5, date: "4 days ago", comment: "Best pasta I've had! The cream sauce is light but flavorful.", verified: true },
            { id: 3, user: "Rachel T.", rating: 4, date: "1 week ago", comment: "Great vegetarian option. Love the seasonal vegetables.", verified: true }
          ],
          5: [ // Burger reviews
            { id: 1, user: "Mark C.", rating: 5, date: "1 day ago", comment: "Incredible burger! The grass-fed beef makes such a difference in taste.", verified: true },
            { id: 2, user: "Jennifer A.", rating: 4, date: "3 days ago", comment: "Juicy and flavorful. The brioche bun is perfectly toasted.", verified: true },
            { id: 3, user: "Alex R.", rating: 5, date: "5 days ago", comment: "Best burger in the city! The signature sauce is amazing.", verified: true }
          ],
          6: [ // Sushi reviews
            { id: 1, user: "Yuki T.", rating: 5, date: "2 days ago", comment: "Extremely fresh fish and perfectly seasoned rice. Authentic and delicious!", verified: true },
            { id: 2, user: "Steven K.", rating: 5, date: "4 days ago", comment: "Outstanding sushi quality. You can taste how fresh everything is.", verified: true },
            { id: 3, user: "Nina F.", rating: 4, date: "1 week ago", comment: "Great sushi rolls. The salmon melts in your mouth!", verified: true }
          ]
        }
        
        const mockReviews = reviewsDatabase[productId] || reviewsDatabase[1]

        // Generate related products (exclude current product)
        const allProductIds = Object.keys(productDatabase).map(Number)
        const otherProductIds = allProductIds.filter(id => id !== parseInt(productId))
        
        // Get 3 random related products
        const shuffledIds = otherProductIds.sort(() => Math.random() - 0.5).slice(0, 3)
        const mockRelatedProducts = shuffledIds.map(id => {
          const product = productDatabase[id]
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            rating: product.rating
          }
        })
        
        setProduct(mockProduct)
        setReviews(mockReviews)
        setRelatedProducts(mockRelatedProducts)
        setSelectedSize(mockProduct.sizes[0])
        setSelectedColor(mockProduct.colors[0])
        
      } catch (error) {
        console.error('Error fetching product:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  // GSAP Animations
  useEffect(() => {
    if (!product || loading) return

    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.fromTo(imageGalleryRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )

      gsap.fromTo(productInfoRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      )

      // Scroll-triggered animations
      ScrollTrigger.create({
        trigger: reviewsRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(reviewsRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          )
        }
      })

      ScrollTrigger.batch(relatedProductsRef.current, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { y: 60, opacity: 0, scale: 0.9 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 0.6, 
              stagger: 0.1, 
              ease: "back.out(1.7)" 
            }
          )
        },
        start: "top 90%"
      })

    }, containerRef)

    return () => ctx.revert()
  }, [product, loading])

  // Image zoom functionality
  const handleMouseMove = (e) => {
    if (!showImageZoom) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

  const addToCart = () => {
    // Add to cart functionality
    console.log('Adding to cart:', { 
      product: product.name, 
      quantity, 
      size: selectedSize, 
      color: selectedColor 
    })
    
    // Show success notification (you could add a toast here)
    alert(`Added ${quantity} ${product.name} to cart!`)
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Product link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-50">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link 
            href="/products"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-colors duration-300"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900"
    >
      {/* Breadcrumb Navigation */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-green-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-green-600 transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link href="/products" className="text-gray-500 hover:text-green-600 transition-colors">
              Products
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div ref={imageGalleryRef} className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowImageZoom(true)}
              onMouseLeave={() => setShowImageZoom(false)}
            >
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Zoom overlay */}
              {showImageZoom && (
                <div 
                  className="absolute inset-0 bg-no-repeat pointer-events-none"
                  style={{
                    backgroundImage: `url(${product.images[selectedImageIndex]})`,
                    backgroundSize: '200%',
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    opacity: 0.8
                  }}
                />
              )}

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.discount}% OFF
                </div>
              )}

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImageIndex === index 
                      ? 'border-green-500 scale-110' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div ref={productInfoRef} className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-600 dark:text-green-400 font-medium text-sm uppercase tracking-wide">
                  {product.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={shareProduct}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ShareIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                ${product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-2xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            {product.sizes && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color/Type Selection */}
            {product.colors && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Type:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                        selectedColor === color
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quantity:</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    disabled={quantity >= product.stockCount}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Max: {product.stockCount}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              disabled={!product.inStock}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                product.inStock
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCartIcon className="w-6 h-6" />
              <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Detailed Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About This Product</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {product.longDescription}
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Specifications</h3>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{key}:</span>
                    <span className="text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div ref={reviewsRef} className="border-t border-gray-200 dark:border-gray-700 pt-16 mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
            <button className="text-green-600 dark:text-green-400 hover:underline">
              Write a Review
            </button>
          </div>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{review.user}</span>
                        {review.verified && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                ref={(el) => {
                  if (el && !relatedProductsRef.current.includes(el)) {
                    relatedProductsRef.current[index] = el
                  }
                }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${relatedProduct.price}
                      </span>
                      <div className="flex items-center">
                        <StarSolidIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}