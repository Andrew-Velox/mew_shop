'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SustainabilitySection() {
  const [isVisible, setIsVisible] = useState(false)
  
  // GSAP refs
  const sustainabilityRef = useRef(null)
  const sustainabilityCardRef = useRef(null)
  const featuresRef = useRef([])
  const statsRef = useRef([])

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

    if (sustainabilityRef.current) {
      observer.observe(sustainabilityRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Sustainability section entrance
      ScrollTrigger.create({
        trigger: sustainabilityCardRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          gsap.fromTo(sustainabilityCardRef.current,
            { y: 100, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
          )

          // Animate features with stagger
          gsap.fromTo(featuresRef.current,
            { y: 60, opacity: 0, rotateX: 45 },
            { 
              y: 0, 
              opacity: 1, 
              rotateX: 0,
              duration: 0.8, 
              stagger: 0.15, 
              ease: "back.out(1.7)",
              delay: 0.3
            }
          )

          // Animate stats with bounce
          gsap.fromTo(statsRef.current,
            { scale: 0, opacity: 0 },
            { 
              scale: 1, 
              opacity: 1, 
              duration: 0.6, 
              stagger: 0.1, 
              ease: "elastic.out(1, 0.5)",
              delay: 0.6
            }
          )
        }
      })

      // Hover animations for features
      featuresRef.current.forEach((feature, index) => {
        if (feature) {
          feature.addEventListener('mouseenter', () => {
            gsap.to(feature, { 
              scale: 1.05, 
              y: -5,
              duration: 0.3, 
              ease: "power2.out" 
            })
          })
          feature.addEventListener('mouseleave', () => {
            gsap.to(feature, { 
              scale: 1, 
              y: 0,
              duration: 0.3, 
              ease: "power2.out" 
            })
          })
        }
      })

    }, sustainabilityRef)

    return () => ctx.revert()
  }, [])

  const sustainabilityFeatures = [
    {
      icon: '♻️',
      title: 'Eco-Friendly Products',
      description: 'Sustainable tech choices'
    },
    {
      icon: '🌱',
      title: 'Carbon Reduction',
      description: 'Minimizing environmental impact'
    },
    {
      icon: '🔬',
      title: 'Expert Research',
      description: 'Quality & sustainability standards'
    },
    {
      icon: '💡',
      title: 'Innovation Focus',
      description: 'Next-gen green technology'
    }
  ]

  const impactStats = [
    { value: '15K+', label: 'Eco Products Sold', icon: '🛍️' },
    { value: '2.5T', label: 'CO₂ Saved (tons)', icon: '🌍' },
    { value: '500+', label: 'Green Partners', icon: '🤝' },
    { value: '98%', label: 'Satisfaction Rate', icon: '⭐' }
  ]

  return (
    <section 
      ref={sustainabilityRef} 
      className="bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={sustainabilityCardRef}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-6 shadow-lg">
            <span className="text-2xl">🌍</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Our{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Sustainability Mission
            </span>
          </h2>
          <p className="text-lg text-green-100 max-w-3xl mx-auto leading-relaxed">
            Leading the way in eco-friendly technology solutions. Together, we&apos;re building a more sustainable digital future.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sustainabilityFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              ref={(el) => {
                if (el && !featuresRef.current.includes(el)) {
                  featuresRef.current[index] = el
                }
              }}
              className={`group bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 border border-white/20 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: `${index * 200}ms` 
              }}
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {impactStats.map((stat, index) => (
            <div 
              key={stat.label}
              ref={(el) => {
                if (el && !statsRef.current.includes(el)) {
                  statsRef.current[index] = el
                }
              }}
              className={`text-center transform hover:scale-105 transition-all duration-300 ${
                isVisible ? 'animate-bounce' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: `${index * 300 + 1000}ms`,
                animationDuration: '2s',
                animationFillMode: 'forwards'
              }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
