'use client'

import { useState, useEffect } from 'react'
import { auth } from '../utils/auth'

export default function UserInfo() {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check login status and get user data
    const loggedIn = auth.isLoggedIn()
    setIsLoggedIn(loggedIn)
    
    if (loggedIn) {
      const userData = auth.getUserData()
      setUser(userData)
    }
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">Not logged in</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
        Welcome back! 👋
      </h3>
      {user && (
        <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Active:</strong> {user.is_active ? 'Yes' : 'No'}</p>
        </div>
      )}
      
      <button
        onClick={auth.logout}
        className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  )
}
