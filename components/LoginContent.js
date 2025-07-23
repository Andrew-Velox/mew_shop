'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // GSAP refs
  const containerRef = useRef(null)
  const formRef = useRef(null)
  const titleRef = useRef(null)
  const fieldsRef = useRef([])

  const router = useRouter()

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Container entrance
      gsap.fromTo(containerRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )

      // Title animation
      gsap.fromTo(titleRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
      )

      // Staggered field animation
      gsap.fromTo(fieldsRef.current,
        { x: -50, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.15, 
          ease: "power2.out", 
          delay: 0.4 
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      console.log('=== LOGIN ATTEMPT STARTED ===')
      console.log('Attempting login with:', formData) // Debug log
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(formData)
      })

      console.log('=== RESPONSE RECEIVED ===')
      console.log('Response status:', response.status) // Debug log
      console.log('Response ok:', response.ok) // Debug log
      console.log('Response headers:', Object.fromEntries(response.headers)) // Debug log

      const data = await response.json()
      console.log('=== RESPONSE DATA PARSED ===')
      console.log('Login response:', data) // Debug log
      console.log('Has token:', !!data.token) // Debug log
      console.log('Has user:', !!data.user) // Debug log

      if (response.ok) {
        console.log('=== RESPONSE OK - PROCESSING ===')
        
        // Check if response contains an error (even with 200 status)
        if (data.error) {
          console.log('=== ERROR IN RESPONSE DATA ===')
          console.log('Error:', data.error)
          setErrors({ general: data.error })
          return
        }
        
        // Check if response contains token (successful login)
        if (data.token && data.user) {
          console.log('=== LOGIN SUCCESSFUL - STORING DATA ===')
          console.log('Token:', data.token.substring(0, 10) + '...')
          console.log('User:', data.user)
          
          try {
            // Store authentication data
            localStorage.setItem('authToken', data.token)
            console.log('✓ Token stored')
            
            localStorage.setItem('userData', JSON.stringify(data.user))
            console.log('✓ User data stored')
            
            localStorage.setItem('userId', data.user.id.toString())
            console.log('✓ User ID stored')
            
            localStorage.setItem('username', data.user.username)
            console.log('✓ Username stored')
            
            localStorage.setItem('userEmail', data.user.email)
            console.log('✓ Email stored')
            
            localStorage.setItem('userFullName', `${data.user.first_name} ${data.user.last_name}`.trim())
            console.log('✓ Full name stored')
            
            localStorage.setItem('loginTime', new Date().toISOString())
            console.log('✓ Login time stored')
            
            localStorage.setItem('isLoggedIn', 'true')
            console.log('✓ Login flag stored')
            
            console.log('=== VERIFYING STORED DATA ===')
            console.log('Auth token:', localStorage.getItem('authToken')?.substring(0, 10) + '...')
            console.log('Is logged in:', localStorage.getItem('isLoggedIn'))
            console.log('User data:', localStorage.getItem('userData'))
            
          } catch (storageError) {
            console.error('=== LOCALSTORAGE ERROR ===')
            console.error('Storage error:', storageError)
            setErrors({ general: 'Failed to store login data. Please try again.' })
            return
          }

          console.log('=== SHOWING SUCCESS MESSAGE ===')
          setSuccessMessage('Login successful! Redirecting...')
          setFormData({
            username: '',
            password: ''
          })
          
          // Trigger storage event for other tabs/components
          console.log('=== TRIGGERING STORAGE EVENT ===')
          window.dispatchEvent(new Event('storage'))
          
          // Trigger custom auth event for immediate same-tab updates
          console.log('=== TRIGGERING AUTH STATE CHANGED EVENT ===')
          window.dispatchEvent(new Event('authStateChanged'))
          
          console.log('=== REDIRECTING IN 1.5 SECONDS ===')
          // Redirect to profile page
          setTimeout(() => {
            console.log('=== EXECUTING REDIRECT ===')
            router.push('/profile')
          }, 1500)
        } else {
          console.log('=== NO TOKEN OR USER IN RESPONSE ===')
          console.log('Response data:', data)
          setErrors({ general: 'Login failed. Invalid response from server.' })
        }
      } else {
        console.log('=== RESPONSE NOT OK ===')
        console.log('Response not OK, status:', response.status) // Debug log
        console.log('Response data:', data)
        
        // Handle different response types
        let errorData
        try {
          errorData = data // We already parsed it above
        } catch (parseError) {
          console.log('=== PARSE ERROR ===')
          console.log('Failed to parse error response:', parseError) // Debug log
          errorData = { error: 'Failed to parse server response' }
        }
        
        console.log('Error data:', errorData) // Debug log
        
        if (errorData) {
          // Handle specific error formats
          if (typeof errorData === 'object') {
            if (errorData.error) {
              setErrors({ general: errorData.error })
            } else if (errorData.message) {
              setErrors({ general: errorData.message })
            } else if (errorData.non_field_errors) {
              // Django REST framework error format
              setErrors({ general: Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors.join(', ') : errorData.non_field_errors })
            } else if (errorData.detail) {
              // Django REST framework detail error
              setErrors({ general: errorData.detail })
            } else {
              // Field-specific errors
              setErrors(errorData)
            }
          } else {
            setErrors({ general: errorData })
          }
        } else {
          setErrors({ general: 'Invalid username or password' })
        }
      }
    } catch (error) {
      console.error('=== CATCH ERROR ===')
      console.error('Login error:', error)
      console.error('Error stack:', error.stack)
      
      // More specific error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrors({ 
          general: 'Cannot connect to server. Please check your internet connection and try again.' 
        })
      } else if (error.name === 'NetworkError' || error.message.includes('NetworkError')) {
        setErrors({ 
          general: 'Network error. Please check your internet connection.' 
        })
      } else {
        setErrors({ 
          general: `Connection error: ${error.message}. Please try again later.` 
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={containerRef}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 border border-green-100 dark:border-green-800"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              ref={titleRef}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your <span className="text-green-600 dark:text-green-400 font-semibold">MewShop</span> account
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center">
                <span className="mr-2">❌</span>
                <p className="text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div ref={(el) => fieldsRef.current[0] = el}>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>}
            </div>

            {/* Password */}
            <div ref={(el) => fieldsRef.current[1] = el}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  New to MewShop?
                </span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center w-full py-3 px-4 border border-green-600 dark:border-green-400 rounded-lg text-green-600 dark:text-green-400 font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
            >
              Create New Account
            </Link>
          </div>

          {/* Additional Links */}
          <div className="mt-6 flex justify-center space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
