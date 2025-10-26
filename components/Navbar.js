'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '../utils/auth'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const [isScrolled, setIsScrolled] = useState(false)
  
  // GSAP refs
  const navbarRef = useRef(null)
  const logoRef = useRef(null)
  const searchRef = useRef(null)
  const menuItemsRef = useRef([])
  const mobileMenuRef = useRef(null)
  const buttonsRef = useRef([])
  
  const router = useRouter()
  const pathname = usePathname()

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      console.log('Navbar: Checking auth status...') // Debug log
      const loggedIn = auth.isLoggedIn()
      console.log('Navbar: Is logged in:', loggedIn) // Debug log
      setIsLoggedIn(loggedIn)
      if (loggedIn) {
        const user = auth.getUserData()
        console.log('Navbar: User data:', user) // Debug log
        setUserData(user)
      } else {
        console.log('Navbar: Clearing user data') // Debug log
        setUserData(null)
      }
    }

    // Check initially
    checkAuthStatus()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      console.log('Navbar: Storage change detected:', e.key, e.newValue) // Debug log
      if (e.key === 'authToken' || e.key === 'isLoggedIn' || e.key === 'userData') {
        checkAuthStatus()
      }
    }

    // Listen for custom auth events (for same-tab updates)
    const handleAuthChange = () => {
      console.log('Navbar: Auth change event received') // Debug log
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authStateChanged', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleAuthChange)
    }
  }, [])
  
  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        // Check if user is logged in first
        const authToken = localStorage.getItem('authToken')
        if (!authToken) {
          setCartCount(0)
          return
        }
        
        const cartCode = localStorage.getItem('cart_code')
        if (!cartCode) return
        
        const response = await fetch(`/api/cart?cart_code=${cartCode}`)
        if (response.ok) {
          const data = await response.json()
          setCartCount(data.total_items || 0)
        }
      } catch (error) {
        console.error('Error fetching cart count:', error)
      }
    }
    
    // Fetch initially
    fetchCartCount()
    
    // Refresh cart count every 30 seconds
    const interval = setInterval(fetchCartCount, 30000)
    
    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartCount()
    }
    
    // Listen for logout events
    const handleLogout = () => {
      setCartCount(0)
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('userLoggedOut', handleLogout)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('userLoggedOut', handleLogout)
    }
  }, [])

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP Navbar Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial navbar entrance animation
      gsap.fromTo(navbarRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )

      // Logo animation with bounce
      gsap.fromTo(logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.7)", delay: 0.3 }
      )

      // Staggered menu items animation
      gsap.fromTo(menuItemsRef.current,
        { y: -30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power2.out", 
          delay: 0.5 
        }
      )

      // Search bar animation
      gsap.fromTo(searchRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.7 }
      )

      // Buttons animation
      gsap.fromTo(buttonsRef.current,
        { x: 50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power2.out", 
          delay: 0.9 
        }
      )

      // Hover animations for menu items
      menuItemsRef.current.forEach((item, index) => {
        if (item) {
          item.addEventListener('mouseenter', () => {
            gsap.to(item, { scale: 1.1, y: -2, duration: 0.3, ease: "power2.out" })
          })
          item.addEventListener('mouseleave', () => {
            gsap.to(item, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" })
          })
        }
      })

    }, navbarRef)

    return () => ctx.revert()
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Navigation items
  const navItems = [
    { name: 'Home', href: '/', icon: '' },
    { name: 'Products', href: '/products', icon: '' },
    { name: 'Blog', href: '/blog', icon: '' },
    { name: 'Tools', href: '/tools', icon: '' },
    { name: 'Finance Tools', href: '/finance-tools', icon: '' },
    { name: 'About', href: '/about', icon: '' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsSearchFocused(false)
    }
  }

  const handleLogout = async () => {
    console.log('Navbar: Logout clicked')
    setShowUserDropdown(false)
    try {
      await auth.logout()
    } catch (error) {
      console.error('Navbar: Logout error:', error)
      // Force local logout even if API fails
      setIsLoggedIn(false)
      setUserData(null)
      window.location.href = '/login'
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdowns if clicking outside
      if (!event.target.closest('.dropdown-container')) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 /* dark:bg-gray-900/80 */ backdrop-blur-md shadow-xl border-white/20 /* dark:border-gray-700/50 */' 
        : 'bg-white /* dark:bg-gray-900 */ shadow-lg border-gray-200 /* dark:border-gray-700 */'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div 
                ref={logoRef}
                className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200"
              >
                <span className="text-white font-bold text-sm sm:text-lg">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 /* dark:text-white */">
                Mew<span className="text-green-500 /* dark:text-green-400 */">Shop</span>
              </span>
            </Link>
          </div>



          {/* Desktop Navigation - Hidden on mobile/tablet, shown on large+ */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                ref={(el) => {
                  if (el && !menuItemsRef.current.includes(el)) {
                    menuItemsRef.current[index] = el
                  }
                }}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-gray-100 /* dark:hover:bg-gray-800 */ ${
                  pathname === item.href
                    ? 'text-green-600 /* dark:text-green-400 */ bg-green-50 /* dark:bg-green-900/20 */'
                    : 'text-gray-700 /* dark:text-gray-300 */ hover:text-gray-900 /* dark:hover:text-white */'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <span className="text-xs">{item.icon}</span>
                  <span className="hidden xl:inline">{item.name}</span>
                  <span className="xl:hidden">{item.name.length > 8 ? item.icon : item.name}</span>
                </span>
              </Link>
            ))}
          </div>

          {/* Right side controls - Permanent Search + Icons */}
          <div className="flex items-center space-x-3">
            {/* Permanent Search Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                  setSearchQuery('')
                }
              }} 
              className="relative hidden md:block"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-64 pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/70 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Mobile Search Icon */}
            <button
              onClick={() => router.push('/search')}
              className="md:hidden p-2 text-white hover:text-green-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Favorites/Wishlist Icon */}
            <button
              onClick={() => router.push('/wishlist')}
              className="p-2 text-white hover:text-green-600 hover:bg-gray-100 rounded-full transition-all duration-200 relative"
              aria-label="Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            {/* Shopping Cart Icon */}
            <button
              onClick={() => router.push('/cart')}
              className="p-2 text-white hover:text-green-600 hover:bg-gray-100 rounded-full transition-all duration-200 relative"
              aria-label="Shopping cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m10-5v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {/* Cart badge with dynamic count */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User Profile Icon */}
            {isLoggedIn ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="p-2 text-white hover:text-green-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  aria-label="User profile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* User dropdown */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white /* dark:bg-gray-800 */ rounded-md shadow-lg py-1 z-50 border border-gray-200 /* dark:border-gray-700 */">
                    {userData && (
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200 /* dark:border-gray-700 */">
                        <p className="font-medium text-gray-900 /* dark:text-white */">
                          {userData.first_name} {userData.last_name}
                        </p>
                        <p className="text-xs">{userData.email}</p>
                      </div>
                    )}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-white-700 /* dark:text-gray-300 */ hover:bg-gray-100 /* dark:hover:bg-gray-700 */ transition-colors duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-white-700 /* dark:text-gray-300 */ hover:bg-gray-100 /* dark:hover:bg-gray-700 */ transition-colors duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 /* dark:text-gray-300 */ hover:bg-gray-100 /* dark:hover:bg-gray-700 */ transition-colors duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-200 /* dark:border-gray-700 */" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 /* dark:text-red-400 */ hover:bg-gray-100 /* dark:hover:bg-gray-700 */ transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="p-2 text-white hover:text-green-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  aria-label="User menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {/* User dropdown for non-logged in users */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-green-600 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button - Always visible on small screens */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu - Shows on mobile and tablet */}
        {isMenuOpen && (
          <div className={`lg:hidden border-t ${
            isScrolled 
              ? 'border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
          } transition-all duration-300`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent text-sm sm:text-base"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>

              {/* Mobile navigation items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm sm:text-base font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-sm sm:text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                </Link>
              ))}

              {/* Mobile authentication */}
              {!isLoggedIn && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 text-sm sm:text-base font-medium text-white bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 rounded-md transition-colors duration-200 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile user menu when logged in */}
              {isLoggedIn && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="px-3 py-2 text-sm sm:text-base font-medium text-green-600 dark:text-green-400">
                    {userData ? `${userData.first_name} ${userData.last_name}`.trim() || userData.username : 'User Menu'}
                  </div>
                  {userData && (
                    <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                      {userData.email}
                    </div>
                  )}
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await handleLogout()
                        setIsMenuOpen(false)
                      } catch (error) {
                        console.error('Mobile logout error:', error)
                        setIsMenuOpen(false)
                      }
                    }}
                    className="block w-full text-left px-3 py-2 text-sm sm:text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
