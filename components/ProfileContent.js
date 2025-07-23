'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { auth } from '../../utils/auth'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function Profile() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: ''
  })

  // GSAP refs
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const cardRef = useRef(null)
  const fieldsRef = useRef([])

  const router = useRouter()

  // Check authentication and load user data
  useEffect(() => {
    const checkAuthAndLoadData = () => {
      const isLoggedIn = auth.isLoggedIn()
      
      if (!isLoggedIn) {
        router.push('/login')
        return
      }

      const user = auth.getUserData()
      if (user) {
        setUserData(user)
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          username: user.username || ''
        })
      }
      setLoading(false)
    }

    checkAuthAndLoadData()
  }, [router])

  // GSAP Animations
  useEffect(() => {
    if (!loading && userData) {
      const ctx = gsap.context(() => {
        // Container entrance
        gsap.fromTo(containerRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        )

        // Header animation
        gsap.fromTo(headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
        )

        // Card animation
        gsap.fromTo(cardRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.3 }
        )

        // Fields animation
        gsap.fromTo(fieldsRef.current,
          { x: -20, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.5, 
            stagger: 0.1, 
            ease: "power2.out", 
            delay: 0.5 
          }
        )
      }, containerRef)

      return () => ctx.revert()
    }
  }, [loading, userData])

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

  const handleEdit = () => {
    setEditing(true)
    setErrors({})
    setSuccessMessage('')
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      username: userData.username || ''
    })
    setErrors({})
  }

  const handleSave = async () => {
    setUpdateLoading(true)
    setErrors({})

    try {
      // Here you would typically call an API to update the user profile
      // For now, we'll just update localStorage and show success
      
      const updatedUser = {
        ...userData,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username
      }

      // Update localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUser))
      localStorage.setItem('username', updatedUser.username)
      localStorage.setItem('userEmail', updatedUser.email)
      localStorage.setItem('userFullName', `${updatedUser.first_name} ${updatedUser.last_name}`.trim())

      // Update state
      setUserData(updatedUser)
      setEditing(false)
      setSuccessMessage('Profile updated successfully!')
      
      // Trigger auth state change event for navbar update
      window.dispatchEvent(new Event('authStateChanged'))

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)

    } catch (error) {
      console.error('Update profile error:', error)
      setErrors({ general: 'Failed to update profile. Please try again.' })
    } finally {
      setUpdateLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-300">Loading profile...</span>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">Unable to load profile data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={containerRef}>
          {/* Header */}
          <div ref={headerRef} className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account information and preferences
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <CheckIcon className="h-5 w-5 mr-2" />
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center">
                <XMarkIcon className="h-5 w-5 mr-2" />
                <p className="text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div ref={cardRef} className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  {!editing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={updateLoading}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updateLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckIcon className="h-4 w-4" />
                        )}
                        <span>{updateLoading ? 'Saving...' : 'Save'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div ref={(el) => fieldsRef.current[0] = el}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {userData.first_name || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div ref={(el) => fieldsRef.current[1] = el}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {userData.last_name || 'Not provided'}
                      </div>
                    )}
                  </div>

                  {/* Username */}
                  <div ref={(el) => fieldsRef.current[2] = el}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your username"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {userData.username}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div ref={(el) => fieldsRef.current[3] = el}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {userData.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-green-100 dark:border-green-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" />
                  Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userData.is_active 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {userData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Account Type</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userData.is_staff 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {userData.is_staff ? 'Staff' : 'Regular'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">User ID</span>
                    <span className="text-sm font-mono text-gray-900 dark:text-white">#{userData.id}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-green-100 dark:border-green-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CogIcon className="h-5 w-5 mr-2 text-green-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                    📦 View Orders
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                    ❤️ View Wishlist
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                    🔒 Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                    ⚙️ Account Settings
                  </button>
                </div>
              </div>

              {/* Profile Avatar */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-green-100 dark:border-green-800 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {userData.first_name 
                      ? userData.first_name.charAt(0).toUpperCase()
                      : userData.username.charAt(0).toUpperCase()
                    }
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userData.first_name} {userData.last_name} 
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  @{userData.username}
                </p>
                <button className="mt-4 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors duration-200 text-sm">
                  Change Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
