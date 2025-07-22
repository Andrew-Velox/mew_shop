'use client'

import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const [counters, setCounters] = useState([
    { current: 0, target: 10000, suffix: 'K+', label: 'Products', icon: '🛍️', color: 'purple' },
    { current: 0, target: 50, suffix: '+', label: 'Tools', icon: '🔧', color: 'green' },
    { current: 0, target: 100000, suffix: 'K+', label: 'Happy Users', icon: '😊', color: 'blue' },
    { current: 0, target: 247, suffix: '/7', label: 'Support', icon: '🕐', color: 'orange' }
  ])
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef(null)
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const paragraphRef = useRef(null)
  const badgeRef = useRef(null)
  const buttonsRef = useRef(null)
  const backgroundOrbsRef = useRef([])
  const particlesRef = useRef([])
  const gridRef = useRef(null)

  // Format number for display
  const formatNumber = (num, suffix) => {
    if (suffix === 'K+') {
      return Math.floor(num / 1000) + 'K+'
    } else if (suffix === '/7') {
      return '24/7'
    }
    return num + suffix
  }

  // Animate counters
  useEffect(() => {
    if (!isVisible) return

    const animationDuration = 2000 // 2 seconds
    const frameRate = 60
    const totalFrames = animationDuration / (1000 / frameRate)
    
    let frame = 0
    const timer = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      setCounters(prev => prev.map(counter => ({
        ...counter,
        current: Math.min(counter.target, Math.floor(counter.target * easeOutQuart))
      })))

      if (frame >= totalFrames) {
        clearInterval(timer)
      }
    }, 1000 / frameRate)

    return () => clearInterval(timer)
  }, [isVisible])

  // Intersection Observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements
      gsap.set([titleRef.current, paragraphRef.current, badgeRef.current, buttonsRef.current], {
        opacity: 0,
        y: 50
      })

      // Background orbs floating animation
      backgroundOrbsRef.current.forEach((orb, index) => {
        if (orb) {
          gsap.to(orb, {
            y: -30,
            x: index % 2 === 0 ? 20 : -20,
            rotation: 360,
            duration: 8 + index * 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
          })
        }
      })

      // Particles animation
      particlesRef.current.forEach((particle, index) => {
        if (particle) {
          gsap.to(particle, {
            y: -40,
            x: index % 2 === 0 ? 30 : -30,
            rotation: index % 2 === 0 ? 180 : -180,
            duration: 6 + index * 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          })
        }
      })

      // Main content entrance animation
      const tl = gsap.timeline()
      
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      })
      .to(paragraphRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8")
      .to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=0.4")

      // Scroll-triggered animations
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          
          // Parallax background orbs
          backgroundOrbsRef.current.forEach((orb, index) => {
            if (orb) {
              gsap.to(orb, {
                y: -progress * 200 * (index + 1),
                rotation: progress * 360,
                duration: 0.3,
                ease: "none"
              })
            }
          })

          // Fade and scale main content
          gsap.to([titleRef.current, paragraphRef.current], {
            opacity: 1 - progress * 1.5,
            scale: 1 - progress * 0.2,
            duration: 0.3,
            ease: "none"
          })

          // Move buttons and badge
          gsap.to([badgeRef.current, buttonsRef.current], {
            y: -progress * 50,
            opacity: 1 - progress,
            duration: 0.3,
            ease: "none"
          })
        }
      })

      // Mouse movement effect
      const handleMouseMove = (e) => {
        if (!heroRef.current) return
        
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height

        // Subtle parallax for background elements
        backgroundOrbsRef.current.forEach((orb, index) => {
          if (orb) {
            gsap.to(orb, {
              x: x * (20 + index * 5),
              y: y * (15 + index * 5),
              duration: 1,
              ease: "power2.out"
            })
          }
        })

        // Grid movement
        if (gridRef.current) {
          gsap.to(gridRef.current, {
            x: x * 10,
            y: y * 10,
            duration: 0.8,
            ease: "power2.out"
          })
        }
      }

      if (heroRef.current) {
        heroRef.current.addEventListener('mousemove', handleMouseMove)
      }

      return () => {
        if (heroRef.current) {
          heroRef.current.removeEventListener('mousemove', handleMouseMove)
        }
      }
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        text: 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300',
        border: 'hover:border-green-300 dark:hover:border-green-600',
        bg: 'from-green-500/10 to-emerald-500/10'
      },
      green: {
        text: 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300',
        border: 'hover:border-green-300 dark:hover:border-green-600',
        bg: 'from-green-500/10 to-emerald-500/10'
      },
      blue: {
        text: 'text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300',
        border: 'hover:border-blue-300 dark:hover:border-blue-600',
        bg: 'from-blue-500/10 to-cyan-500/10'
      },
      orange: {
        text: 'text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300',
        border: 'hover:border-orange-300 dark:hover:border-orange-600',
        bg: 'from-orange-500/10 to-yellow-500/10'
      }
    }
    return colors[color]
  }
  return (
    <section 
      ref={heroRef}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-50/50 via-white/70 to-green-50/50 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm"
    >
      {/* Background Grid */}
      <div 
        ref={gridRef}
        className="absolute inset-0 grid-background opacity-30"
      />
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0">
        <div 
          ref={(el) => {
            if (el && !backgroundOrbsRef.current.includes(el)) {
              backgroundOrbsRef.current[0] = el
            }
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-green-400/20 rounded-full blur-3xl"
        />
        <div 
          ref={(el) => {
            if (el && !backgroundOrbsRef.current.includes(el)) {
              backgroundOrbsRef.current[1] = el
            }
          }}
          className="absolute top-40 right-32 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl"
        />
        <div 
          ref={(el) => {
            if (el && !backgroundOrbsRef.current.includes(el)) {
              backgroundOrbsRef.current[2] = el
            }
          }}
          className="absolute bottom-32 left-40 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl"
        />
        <div 
          ref={(el) => {
            if (el && !backgroundOrbsRef.current.includes(el)) {
              backgroundOrbsRef.current[3] = el
            }
          }}
          className="absolute bottom-20 right-20 w-56 h-56 bg-teal-400/25 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div 
          ref={(el) => {
            if (el && !particlesRef.current.includes(el)) {
              particlesRef.current[0] = el
            }
          }}
          className="absolute top-32 left-1/4 w-2 h-2 bg-green-400/60 rounded-full"
        />
        <div 
          ref={(el) => {
            if (el && !particlesRef.current.includes(el)) {
              particlesRef.current[1] = el
            }
          }}
          className="absolute top-48 right-1/3 w-1 h-1 bg-emerald-500/70 rounded-full"
        />
        <div 
          ref={(el) => {
            if (el && !particlesRef.current.includes(el)) {
              particlesRef.current[2] = el
            }
          }}
          className="absolute bottom-40 left-1/3 w-1.5 h-1.5 bg-teal-400/50 rounded-full"
        />
        <div 
          ref={(el) => {
            if (el && !particlesRef.current.includes(el)) {
              particlesRef.current[3] = el
            }
          }}
          className="absolute bottom-60 right-1/4 w-2 h-2 bg-green-300/40 rounded-full"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center min-h-screen py-16">
        <div className="text-center">
          <h1 
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              MewShop
            </span>
          </h1>
          <p 
            ref={paragraphRef}
            className="mt-4 sm:mt-6 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed px-4"
          >
            Your sustainable destination for eco-friendly products, tools, and financial solutions. 
            Discover amazing deals, powerful utilities, and expert insights while reducing your digital carbon footprint.
          </p>
          
          {/* Enhanced Sustainability badge with glow effect */}
          <div 
            ref={badgeRef}
            className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-200 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-1000 border border-green-200 dark:border-green-700"
          >
            <span className="animate-spin-slow mr-2">🌍</span>
            Committed to Sustainable Technology
          </div>

          {/* Enhanced CTA Buttons with more dynamic effects */}
          <div 
            ref={buttonsRef}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
          >
            <Link
              href="/products"
              className="group relative inline-flex items-center px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-1000 w-full sm:w-auto justify-center border-2 border-green-400/30 overflow-hidden"
            >
              {/* Cool background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-800 rounded-full"></div>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1500 origin-left rounded-full"></div>
              
              <span className="relative z-10 mr-2">🛍️</span>
              <span className="relative z-10">Explore Products</span>
              <ArrowRightIcon className="relative z-10 ml-3 h-5 w-5 group-hover:translate-x-3 group-hover:rotate-12 transition-all duration-1000" />
            </Link>
            <Link
              href="/tools"
              className="group relative inline-flex items-center px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-semibold text-green-700 dark:text-green-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 border-2 border-green-400 dark:border-green-500 hover:border-green-500 dark:hover:border-green-400 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-1000 w-full sm:w-auto justify-center overflow-hidden"
            >
              {/* Cool ripple effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-800 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-300/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1600 ease-in-out"></div>
              
              <span className="relative z-10 mr-2">🔧</span>
              <span className="relative z-10">Try Our Tools</span>
              <ArrowRightIcon className="relative z-10 ml-3 h-5 w-5 group-hover:translate-x-3 group-hover:rotate-12 transition-all duration-1000" />
            </Link>
          </div>

          {/* Stats - Commented out per user request */}
          {/*
          <div ref={statsRef} className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 px-4">
            {counters.map((stat, index) => {
              const colorClasses = getColorClasses(stat.color)
              return (
                <div key={stat.label} className="group text-center transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 ${colorClasses.border} transition-all duration-300`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-2 right-2 text-yellow-400 animate-ping">✨</div>
                      <div className="absolute bottom-2 left-2 text-yellow-400 animate-ping" style={{animationDelay: '0.5s'}}>⭐</div>
                    </div>
                    
                    <div className="relative mb-2 sm:mb-3 z-10">
                      <div className="text-2xl sm:text-3xl mb-2 animate-bounce" style={{
                        animationDelay: `${index * 0.5}s`, 
                        animationDuration: '2s'
                      }}>
                        {stat.icon}
                      </div>
                      <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${colorClasses.text} transition-colors duration-300 ${isVisible ? 'animate-pulse' : ''}`}>
                        {formatNumber(stat.current, stat.suffix)}
                      </div>
                    </div>
                    <div className="relative z-10 text-sm sm:text-base text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 font-medium transition-colors duration-300">
                      {stat.label}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-2xl overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${stat.color === 'purple' ? 'from-green-500 to-emerald-500' : 
                          stat.color === 'green' ? 'from-green-500 to-emerald-500' :
                          stat.color === 'blue' ? 'from-blue-500 to-cyan-500' : 
                          'from-orange-500 to-yellow-500'} transition-all duration-1000 ease-out`}
                        style={{ 
                          width: isVisible ? '100%' : '0%',
                          transitionDelay: `${index * 200}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          */}
        </div>
      </div>
    </section>
  )
}

// Add custom CSS for live green theme animations
export const heroStyles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
  
  @keyframes float-delayed {
    0%, 100% {
      transform: translateY(0px) rotate(0deg) scale(1);
    }
    50% {
      transform: translateY(-15px) rotate(-180deg) scale(1.1);
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.2);
    }
  }
  
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes ping-slow {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    75%, 100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes shimmer-vertical {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
  
  @keyframes gradient-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
    }
    50% {
      box-shadow: 0 0 40px rgba(34, 197, 94, 0.8), 0 0 60px rgba(16, 185, 129, 0.3);
    }
  }
  
  @keyframes bounce-subtle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
  
  @keyframes wiggle {
    0%, 100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-3deg);
    }
    75% {
      transform: rotate(3deg);
    }
  }
  
  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes button-hover {
    0% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-2px) scale(1.05);
    }
    100% {
      transform: translateY(-4px) scale(1.1);
    }
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  /* Apply animations */
  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 6s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  .animate-ping-slow {
    animation: ping-slow 3s ease-in-out infinite;
    animation-delay: 1.5s;
  }
  
  .animate-shimmer {
    animation: shimmer 3s ease-in-out infinite;
  }
  
  .animate-shimmer-vertical {
    animation: shimmer-vertical 4s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  .animate-gradient-shift {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 1.8s ease-out forwards;
    opacity: 0;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  .animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
  }
  
  .animate-wiggle {
    animation: wiggle 1s ease-in-out infinite;
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  /* Animation delays */
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-3000 {
    animation-delay: 3s;
  }
`
