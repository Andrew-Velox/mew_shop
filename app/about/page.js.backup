'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function About() {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const missionRef = useRef(null)
  const valuesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current,
        { y: -100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
      )

      // Mission section animation
      ScrollTrigger.create({
        trigger: missionRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(missionRef.current,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
          )
        }
      })

      // Values staggered animation
      ScrollTrigger.create({
        trigger: valuesRef.current[0],
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(valuesRef.current,
            { y: 60, opacity: 0, rotateX: 45 },
            { 
              y: 0, 
              opacity: 1, 
              rotateX: 0,
              duration: 0.8, 
              stagger: 0.2, 
              ease: "back.out(1.7)" 
            }
          )
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const coreValues = [
    {
      icon: '🌍',
      title: 'Sustainability First',
      description: 'Every decision we make considers environmental impact and long-term sustainability.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We constantly seek new ways to merge technology with environmental responsibility.'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'Building a community of environmentally conscious technology users worldwide.'
    },
    {
      icon: '🔬',
      title: 'Quality',
      description: 'We provide only the highest quality products that meet our sustainability standards.'
    }
  ]

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 overflow-x-hidden"
    >
      {/* Header */}
      <div 
        ref={headerRef}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-20 border-b border-green-100 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              MewShop
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            We&apos;re on a mission to make sustainable technology accessible to everyone, 
            creating a greener digital future one product at a time.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div 
          ref={missionRef}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-white text-center shadow-2xl"
        >
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            To revolutionize e-commerce by providing sustainable technology solutions that benefit both consumers 
            and the environment. We believe that making eco-friendly choices shouldn&apos;t mean compromising on quality or innovation.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                ref={(el) => {
                  if (el && !valuesRef.current.includes(el)) {
                    valuesRef.current[index] = el
                  }
                }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Be part of the sustainable technology revolution. Together, we can create a more 
            environmentally conscious digital world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
              Shop Sustainable Products
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
