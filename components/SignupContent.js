'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
          stagger: 0.1, 
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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    // First name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    // Last name validation
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password'
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const contentType = response.headers.get('content-type')
        let data
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        } else {
          data = await response.text()
        }
        
        // Check if the response is actually a success message
        if (typeof data === 'string' && !data.includes('error')) {
          setSuccessMessage(data || 'Registration successful! Check your email for confirmation.')
          setFormData({
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: ''
          })
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          // Handle case where response is OK but contains errors
          if (typeof data === 'object' && data !== null) {
            // Handle both field-specific errors and general error format
            if (data.error) {
              // Handle Django's general error format: {'error': 'Email Already Exists'}
              if (data.error.toLowerCase().includes('email')) {
                setErrors({ email: data.error })
              } else if (data.error.toLowerCase().includes('password')) {
                setErrors({ password: data.error })
              } else if (data.error.toLowerCase().includes('username')) {
                setErrors({ username: data.error })
              } else {
                setErrors({ general: data.error })
              }
            } else {
              // Handle field-specific errors: {'username': ['error message']}
              setErrors(data)
            }
          } else {
            setErrors({ general: 'Registration failed. Please try again.' })
          }
        }
      } else {
        const contentType = response.headers.get('content-type')
        let errorData
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json()
        } else {
          errorData = await response.text()
        }
        
        if (errorData) {
          // Handle both field-specific errors and general error format
          if (typeof errorData === 'object' && errorData.error) {
            // Handle Django's general error format
            if (errorData.error.toLowerCase().includes('email')) {
              setErrors({ email: errorData.error })
            } else if (errorData.error.toLowerCase().includes('password')) {
              setErrors({ password: errorData.error })
            } else if (errorData.error.toLowerCase().includes('username')) {
              setErrors({ username: errorData.error })
            } else {
              setErrors({ general: errorData.error })
            }
          } else {
            // Handle field-specific errors or fallback
            setErrors(errorData)
          }
        } else {
          setErrors({ general: 'Registration failed. Please try again.' })
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: 'Network error. Please check your connection and try again.' })
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
              Join <span className="text-green-600 dark:text-green-400">MewShop</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create your account to get started
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <p className="text-sm">{successMessage}</p>
              </div>
              <p className="text-xs mt-2 opacity-80">Redirecting to login page...</p>
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
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Choose a unique username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>}
            </div>

            {/* First Name */}
            <div ref={(el) => fieldsRef.current[1] = el}>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Your first name"
              />
              {errors.first_name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div ref={(el) => fieldsRef.current[2] = el}>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Your last name"
              />
              {errors.last_name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name}</p>}
            </div>

            {/* Email */}
            <div ref={(el) => fieldsRef.current[3] = el}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div ref={(el) => fieldsRef.current[4] = el}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Create a strong password"
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

            {/* Confirm Password */}
            <div ref={(el) => fieldsRef.current[5] = el}>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.confirm_password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirm_password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirm_password}</p>}
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
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors duration-200">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
