'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AboutContent() {
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
            { x: -100, opacity: 0, rotationY: -45 },
            { x: 0, opacity: 1, rotationY: 0, duration: 1.2, ease: "power3.out" }
          )
        }
      })

      // Values cards stagger animation
      ScrollTrigger.batch(valuesRef.current, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { y: 100, opacity: 0, scale: 0.5, rotation: 15 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1, 
              rotation: 0,
              duration: 0.8, 
              stagger: 0.2, 
              ease: "back.out(1.7)" 
            }
          )
        },
        start: "top 85%",
        refreshPriority: -1
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const values = [
    {
      icon: '🌱',
      title: 'Sustainability First',
      description: 'Every decision we make is guided by our commitment to environmental responsibility and sustainable practices.'
    },
    {
      icon: '🤝',
      title: 'Community Focused',
      description: 'We believe in building strong relationships with our customers, partners, and the communities we serve.'
    },
    {
      icon: '⚡',
      title: 'Innovation Driven',
      description: 'We constantly seek new ways to improve our products and services while reducing our environmental footprint.'
    },
    {
      icon: '💎',
      title: 'Quality Excellence',
      description: 'We are committed to delivering products of the highest quality that exceed our customers expectations.'
    }
  ]

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900"
    >
      {/* Header Section */}
      <div 
        ref={headerRef}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-20 border-b border-green-100 dark:border-gray-700"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              MewShop
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Pioneering sustainable commerce for a better tomorrow
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={missionRef}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-green-100 dark:border-gray-700 mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
              At MewShop, we are dedicated to revolutionizing e-commerce by making sustainable, 
              eco-friendly products accessible to everyone. Our mission is to create a marketplace 
              where conscious consumers can easily find products that align with their values, 
              while supporting businesses that prioritize environmental responsibility and ethical practices.
            </p>
          </div>

          {/* Values Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el && !valuesRef.current.includes(el)) {
                    valuesRef.current[index] = el
                  }
                }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 group hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* Story Section */}
          <div className="mt-20 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-gray-800 dark:to-green-900 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Story
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Founded in 2024, MewShop emerged from a simple yet powerful idea: what if shopping 
                  online could actually help heal our planet instead of harming it? Our founders, 
                  passionate environmentalists and tech innovators, saw the need for a platform that 
                  made sustainable shopping effortless and enjoyable.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Today, we work with hundreds of eco-conscious brands and have helped thousands of 
                  customers make more sustainable choices. Every purchase on MewShop contributes to 
                  a healthier planet and supports businesses that share our vision for a sustainable future.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Impact So Far
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Eco Products Sold:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">10,000+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">CO2 Saved:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">5 Tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Partner Brands:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">200+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
