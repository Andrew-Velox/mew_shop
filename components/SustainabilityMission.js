'use client'

import { useState, useEffect, useRef } from 'react'

export default function SustainabilityMission() {
  const [isVisible, setIsVisible] = useState(false)
  const missionRef = useRef(null)

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (missionRef.current) {
      observer.observe(missionRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  const sustainabilityFeatures = [
    {
      icon: '♻️',
      title: 'Eco-Friendly Products',
      description: 'Curated selection of energy-efficient and sustainable tech products'
    },
    {
      icon: '🌱',
      title: 'Carbon Footprint Reduction',
      description: 'Help reduce digital environmental impact through conscious choices'
    },
    {
      icon: '🔬',
      title: 'Expert Research',
      description: 'Rigorous testing ensures all products meet sustainability standards'
    },
    {
      icon: '📚',
      title: 'Educational Resources',
      description: 'Learn how to make better environmental choices with technology'
    }
  ]

  return (
    <div className="py-16 sm:py-24 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div ref={missionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-8 shadow-lg">
            <span className="text-2xl">🌍</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Sustainability Mission
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            At MewShop, we believe technology and sustainability go hand in hand. 
            We&apos;re committed to helping you reduce your digital carbon footprint while enjoying the benefits of modern technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sustainabilityFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: isVisible ? `${index * 150}ms` : '0ms'
              }}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              
              {/* Animated bottom border */}
              <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: isVisible ? '100%' : '0%',
                    transitionDelay: `${index * 150 + 300}ms`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Stats Preview */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
              <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Tons CO₂ Saved
              </div>
            </div>
            <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                10K+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Eco-Conscious Customers
              </div>
            </div>
            <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                200+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Educational Articles
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`mt-12 text-center transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '900ms' }}>
          <a
            href="/about"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-full hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <span>Learn More About Our Mission</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
