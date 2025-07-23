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
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Products', href: '/products', icon: '🛍️' },
    { name: 'Blog', href: '/blog', icon: '📝' },
    { name: 'Tools', href: '/tools', icon: '🔧' },
    { name: 'Finance Tools', href: '/finance-tools', icon: '💰' },
    { name: 'About', href: '/about', icon: 'ℹ️' }
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

          {/* Search Bar - Hidden on small screens, shown on medium+ */}
          <div 
            ref={searchRef}
            className="hidden md:flex items-center flex-1 max-w-lg mx-4 lg:mx-8"
          >
            <form onSubmit={handleSearch} className="relative w-full">
              <div className={`relative transition-all duration-200 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search products, tools, articles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 /* dark:border-gray-600 */ rounded-full bg-gray-50 /* dark:bg-gray-800 */ text-gray-900 /* dark:text-white */ placeholder-gray-500 /* dark:placeholder-gray-400 */ focus:outline-none focus:ring-2 focus:ring-green-500 /* dark:focus:ring-green-400 */ focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-100 /* dark:hover:bg-gray-800 */ ${
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

          {/* Right side controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Authentication - Hidden on small screens for mobile menu */}
            {isLoggedIn ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-full bg-green-100 /* dark:bg-green-900 */ text-green-700 /* dark:text-green-300 */ hover:bg-green-200 /* dark:hover:bg-green-800 */ transition-colors duration-200"
                  title={userData ? `${userData.first_name} ${userData.last_name}`.trim() || userData.username : 'User Menu'}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 /* dark:bg-green-600 */ rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {userData && userData.first_name 
                        ? userData.first_name.charAt(0).toUpperCase()
                        : userData && userData.username
                        ? userData.username.charAt(0).toUpperCase()
                        : 'U'
                      }
                    </span>
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">
                    {userData && userData.first_name 
                      ? userData.first_name
                      : userData && userData.username
                      ? userData.username
                      : 'Profile'
                    }
                  </span>
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
                      className="block px-4 py-2 text-sm text-gray-700 /* dark:text-gray-300 */ hover:bg-gray-100 /* dark:hover:bg-gray-700 */ transition-colors duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      👤 Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 /* dark:text-gray-300 */ hover:bg-gray-100 /* dark:hover:bg-gray-700 */ transition-colors duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      📦 Orders
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 /* dark:text-gray-300 */ hover:bg-gray-100 /* dark:hover:bg-gray-700 */ transition-colors duration-200"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <hr className="my-1 border-gray-200 /* dark:border-gray-700 */" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 /* dark:text-red-400 */ hover:bg-gray-100 /* dark:hover:bg-gray-700 */ transition-colors duration-200"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <Link
                  ref={(el) => {
                    if (el && !buttonsRef.current.includes(el)) {
                      buttonsRef.current[0] = el
                    }
                  }}
                  href="/login"
                  className="px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link
                  ref={(el) => {
                    if (el && !buttonsRef.current.includes(el)) {
                      buttonsRef.current[1] = el
                    }
                  }}
                  href="/signup"
                  className="px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium text-white bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
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
                    🚪 Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-3 py-2 text-sm sm:text-base font-medium text-white bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 rounded-md transition-colors duration-200 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📝 Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile user menu when logged in */}
              {isLoggedIn && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="px-3 py-2 text-sm sm:text-base font-medium text-green-600 dark:text-green-400">
                    👤 {userData ? `${userData.first_name} ${userData.last_name}`.trim() || userData.username : 'User Menu'}
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
                    👤 Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📦 Orders
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ⚙️ Settings
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
                    🚪 Logout
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
