'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Tools() {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const toolsGridRef = useRef([])
  const featuresRef = useRef([])
  const everythingRef = useRef(null)
  const everythingItemsRef = useRef([])
  const everythingTitleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // INITIAL STATES - Critical for animations
      if (everythingTitleRef.current) {
        gsap.set(everythingTitleRef.current, { 
          scale: 0, 
          opacity: 0, 
          rotationY: -45
        })
      }
      
      // Set initial states for everything items
      const validItems = everythingItemsRef.current.filter(item => item !== null)
      if (validItems.length > 0) {
        gsap.set(validItems, (index) => ({
          y: 150, 
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0, 
          scale: 0.5, 
          rotationY: index % 2 === 0 ? -45 : 45
        }))
      }

      // Header entrance animation
      gsap.fromTo(headerRef.current,
        { y: -100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
      )

      // Tools grid staggered animation
      gsap.fromTo(toolsGridRef.current,
        { y: 80, opacity: 0, rotateY: 45 },
        { 
          y: 0, 
          opacity: 1, 
          rotateY: 0,
          duration: 0.8, 
          stagger: 0.15, 
          ease: "back.out(1.7)",
          delay: 0.5
        }
      )

      // Features scroll animation
      ScrollTrigger.batch(featuresRef.current, {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { x: -100, opacity: 0, rotation: -5 },
            { 
              x: 0, 
              opacity: 1, 
              rotation: 0,
              duration: 1, 
              stagger: 0.2, 
              ease: "power3.out" 
            }
          )
        },
        start: "top 80%",
        refreshPriority: -1
      })

      // Hover animations for tools
      toolsGridRef.current.forEach((tool, index) => {
        if (tool) {
          tool.addEventListener('mouseenter', () => {
            gsap.to(tool, { 
              scale: 1.05, 
              y: -10,
              rotateY: 5,
              duration: 0.4, 
              ease: "power2.out" 
            })
          })
          tool.addEventListener('mouseleave', () => {
            gsap.to(tool, { 
              scale: 1, 
              y: 0,
              rotateY: 0,
              duration: 0.4, 
              ease: "power2.out" 
            })
          })
        }
      })

      // MAIN EVERYTHING SECTION ANIMATIONS
      ScrollTrigger.create({
        trigger: everythingRef.current,
        start: "top 80%",
        onEnter: () => {
          console.log('🎯 EVERYTHING SECTION TRIGGERED!') 
          
          // Title Animation - Dramatic Entrance
          if (everythingTitleRef.current) {
            gsap.fromTo(everythingTitleRef.current,
              { scale: 0, opacity: 0, rotationY: -45, y: -50 },
              { 
                scale: 1, 
                opacity: 1, 
                rotationY: 0,
                y: 0,
                duration: 1.8, 
                ease: "elastic.out(1, 0.6)"
              }
            )
          }

          // Cards - Spectacular Staggered Entrance
          const validItems = everythingItemsRef.current.filter(item => item !== null)
          console.log('🎨 Animating', validItems.length, 'cards') 
          
          if (validItems.length > 0) {
            gsap.fromTo(validItems,
              { 
                y: 200, 
                x: (index) => (index % 2 === 0 ? -200 : 200),
                opacity: 0, 
                scale: 0.3, 
                rotationY: (index) => (index % 2 === 0 ? -90 : 90),
                rotationX: 45
              },
              { 
                y: 0,
                x: 0, 
                opacity: 1, 
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                duration: 1.5, 
                stagger: 0.4, 
                ease: "back.out(1.7)",
                delay: 0.5
              }
            )
          }
        }
      })

      // Enhanced Hover Effects for Everything Section
      everythingItemsRef.current.forEach((item, index) => {
        if (item && index < 4) { // Main cards only
          item.addEventListener('mouseenter', () => {
            gsap.to(item, { 
              scale: 1.08, 
              y: -20,
              rotationY: index % 2 === 0 ? 10 : -10,
              rotationX: 5,
              duration: 0.5, 
              ease: "power2.out",
              transformPerspective: 1000
            })
          })
          item.addEventListener('mouseleave', () => {
            gsap.to(item, { 
              scale: 1, 
              y: 0,
              rotationY: 0,
              rotationX: 0,
              duration: 0.5, 
              ease: "power2.out" 
            })
          })
        } else if (item && index === 4) { // Newsletter section
          item.addEventListener('mouseenter', () => {
            gsap.to(item, { 
              scale: 1.05, 
              y: -10,
              duration: 0.4, 
              ease: "power2.out" 
            })
          })
          item.addEventListener('mouseleave', () => {
            gsap.to(item, { 
              scale: 1, 
              y: 0,
              duration: 0.4, 
              ease: "power2.out" 
            })
          })
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const toolCategories = [
    {
      id: 1,
      title: 'Design Tools',
      icon: '🎨',
      description: 'Creative design utilities for professionals',
      color: 'from-purple-500 to-pink-500',
      tools: ['Color Palette Generator', 'Logo Maker', 'Icon Library']
    },
    {
      id: 2,
      title: 'Developer Tools',
      icon: '⚡',
      description: 'Powerful coding and development utilities',
      color: 'from-blue-500 to-cyan-500',
      tools: ['Code Formatter', 'API Tester', 'Database Designer']
    },
    {
      id: 3,
      title: 'Marketing Tools',
      icon: '📈',
      description: 'Boost your marketing campaigns',
      color: 'from-green-500 to-emerald-500',
      tools: ['SEO Analyzer', 'Content Planner', 'Social Media Scheduler']
    },
    {
      id: 4,
      title: 'Productivity Tools',
      icon: '⚡',
      description: 'Streamline your workflow',
      color: 'from-orange-500 to-red-500',
      tools: ['Task Manager', 'Time Tracker', 'Note Organizer']
    },
    {
      id: 5,
      title: 'Analytics Tools',
      icon: '📊',
      description: 'Data analysis and reporting',
      color: 'from-indigo-500 to-purple-500',
      tools: ['Chart Generator', 'Report Builder', 'Data Visualizer']
    },
    {
      id: 6,
      title: 'Communication Tools',
      icon: '💬',
      description: 'Enhance team collaboration',
      color: 'from-teal-500 to-green-500',
      tools: ['Team Chat', 'Video Conferencing', 'File Sharing']
    }
  ]

  const keyFeatures = [
    {
      icon: '🚀',
      title: 'Lightning Fast',
      description: 'All tools are optimized for speed and performance'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: '🌍',
      title: 'Eco-Friendly',
      description: 'Carbon-neutral hosting and sustainable practices'
    },
    {
      icon: '💡',
      title: 'AI-Powered',
      description: 'Smart features powered by artificial intelligence'
    }
  ]

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900"
    >
      {/* Header */}
      <div 
        ref={headerRef}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-20 border-b border-blue-100 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            Supercharge your productivity with our comprehensive suite of professional tools
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              🆓 Free to Use
            </span>
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              ⚡ No Registration Required
            </span>
            <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              🔄 Always Updated
            </span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolCategories.map((category, index) => (
            <div
              key={category.id}
              ref={(el) => {
                if (el && !toolsGridRef.current.includes(el)) {
                  toolsGridRef.current[index] = el
                }
              }}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${category.color} p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className="text-6xl transform rotate-12">{category.icon}</div>
                </div>
                <div className="relative z-10">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-white/90">{category.description}</p>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Available Tools
                </h4>
                <ul className="space-y-2">
                  {category.tools.map((tool, toolIndex) => (
                    <li key={toolIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {tool}
                    </li>
                  ))}
                </ul>
                
                <button className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 group-hover:scale-105 transform">
                  Explore Tools →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Tools?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Built with performance, security, and sustainability in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyFeatures.map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => {
                  if (el && !featuresRef.current.includes(el)) {
                    featuresRef.current[index] = el
                  }
                }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Everything You Need in One Place Section - REBUILT WITH GSAP */}
      <section 
        ref={everythingRef}
        className="py-24 px-6 sm:px-12 lg:px-24 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-hidden relative"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Title Section */}
          <div className="text-center mb-20">
            <h2 
              ref={everythingTitleRef}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent leading-tight"
            >
              Everything You Need in One Place
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              From shopping to productivity tools and financial planning, MewShop has got you covered with our comprehensive ecosystem.
            </p>
          </div>
          
          {/* Main Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {[
              {
                icon: '🛍️',
                title: 'Premium Products',
                description: 'Discover our curated selection of high-quality products with competitive prices, fast shipping, and exceptional customer service.',
                features: ['Latest Electronics', 'Fashion Trends', 'Home Essentials', 'Sports & Fitness'],
                gradient: 'from-pink-500 via-rose-500 to-red-500'
              },
              {
                icon: '🔧',
                title: 'Powerful Tools',
                description: 'Access professional-grade tools and utilities designed to boost your productivity, creativity, and efficiency in every project.',
                features: ['Design Suite', 'Code Generators', 'Analytics Tools', 'Automation'],
                gradient: 'from-blue-500 via-cyan-500 to-teal-500'
              },
              {
                icon: '💰',
                title: 'Finance Tools',
                description: 'Take control of your finances with comprehensive tools for budgeting, investment tracking, and financial planning.',
                features: ['Budget Planner', 'Investment Tracker', 'Loan Calculator', 'Crypto Monitor'],
                gradient: 'from-green-500 via-emerald-500 to-teal-500'
              },
              {
                icon: '📝',
                title: 'Expert Blog',
                description: 'Stay informed with the latest industry insights, product reviews, tutorials, and expert advice from our team.',
                features: ['Product Reviews', 'Tech Updates', 'Financial Tips', 'How-to Guides'],
                gradient: 'from-purple-500 via-indigo-500 to-blue-500'
              }
            ].map((item, index) => (
              <div 
                key={index}
                ref={el => everythingItemsRef.current[index] = el}
                className="group cursor-pointer transform-gpu perspective-1000"
              >
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50 dark:border-gray-700/50 h-full transform-gpu">
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${item.gradient} p-10 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-6 right-6 text-9xl opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-700">
                      {item.icon}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="text-8xl mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 filter drop-shadow-lg">
                        {item.icon}
                      </div>
                      <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-yellow-200 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-xl leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      {item.features.map((feature, featureIndex) => (
                        <div 
                          key={featureIndex}
                          className="bg-gray-100 dark:bg-gray-700 rounded-xl p-5 text-center transform group-hover:scale-105 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900 dark:hover:to-blue-900"
                        >
                          <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <button className={`w-full bg-gradient-to-r ${item.gradient} text-white py-5 px-8 rounded-xl font-bold text-xl transform group-hover:scale-105 group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}>
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Explore Now
                        <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </button>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 blur-xl transform scale-110 transition-all duration-700 pointer-events-none -z-10`}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Newsletter Section */}
          <div className="text-center">
            <div 
              ref={el => everythingItemsRef.current[4] = el}
              className="max-w-4xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-16 shadow-2xl border border-white/50 dark:border-gray-700/50 relative overflow-hidden transform-gpu"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>
              
              <div className="relative z-10">
                <h3 className="text-5xl font-bold text-gray-900 dark:text-white mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Stay Updated with MewShop
                </h3>
                <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                  Get the latest product launches, exclusive deals, and helpful tips delivered straight to your inbox.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto mb-8">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="flex-1 px-8 py-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 text-xl"
                  />
                  <button className="px-12 py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white rounded-xl font-bold text-xl hover:scale-105 hover:shadow-2xl transform transition-all duration-300 relative overflow-hidden group">
                    <span className="relative z-10">Subscribe</span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </button>
                </div>
                
                <div className="flex justify-center items-center gap-8 text-lg text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <span className="text-green-500 text-xl">✓</span>
                    No spam, ever
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-blue-500 text-xl">✓</span>
                    Unsubscribe anytime
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-purple-500 text-xl">✓</span>
                    Weekly updates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
