'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <div className="min-h-screen py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Search Results
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {query ? `Searching for: "${query}"` : 'Enter a search term to get started'}
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              🔍 Search functionality coming soon!
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              This page will be integrated with your Django API to search products, tools, and content.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Search() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  )
}
