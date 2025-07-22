'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function AnimatedBackground() {
  const containerRef = useRef(null)
  const particlesRef = useRef([])
  const shapesRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Clean particle system - subtle floating dots
    class MinimalParticle {
      constructor() {
        this.reset()
        this.opacity = Math.random() * 0.4 + 0.1 // Very subtle opacity
        this.pulsePhase = Math.random() * Math.PI * 2
      }

      reset() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.vx = (Math.random() - 0.5) * 0.3 // Slower movement
        this.vy = (Math.random() - 0.5) * 0.3
        this.size = Math.random() * 2 + 1 // Smaller particles
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.pulsePhase += 0.01 // Slower pulse

        // Gentle boundary wrapping
        if (this.x < -20) this.x = window.innerWidth + 20
        if (this.x > window.innerWidth + 20) this.x = -20
        if (this.y < -20) this.y = window.innerHeight + 20
        if (this.y > window.innerHeight + 20) this.y = -20
      }
    }

    // Create minimal particles
    const minimalParticles = []
    const particleElements = []
    const particleCount = 25 // Fewer particles for cleaner look
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new MinimalParticle()
      const element = document.createElement('div')
      
      element.style.cssText = `
        position: absolute;
        width: ${particle.size}px;
        height: ${particle.size}px;
        background: rgba(34, 197, 94, ${particle.opacity});
        border-radius: 50%;
        pointer-events: none;
        left: ${particle.x}px;
        top: ${particle.y}px;
        box-shadow: 0 0 ${particle.size * 2}px rgba(34, 197, 94, 0.2);
      `
      
      container.appendChild(element)
      minimalParticles.push(particle)
      particleElements.push(element)
    }

    // Create floating geometric shapes with professional design
    const geometricShapes = []
    const shapeCount = 12 // Optimal number for clean look

    const shapeTypes = [
      { type: 'circle', name: 'Circle' },
      { type: 'square', name: 'Square' },
      { type: 'triangle', name: 'Triangle' },
      { type: 'hexagon', name: 'Hexagon' },
      { type: 'diamond', name: 'Diamond' },
      { type: 'pentagon', name: 'Pentagon' }
    ]

    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement('div')
      const size = Math.random() * 30 + 20 // Larger, more visible shapes
      const x = Math.random() * (window.innerWidth - 100) + 50 // Keep away from edges
      const y = Math.random() * (window.innerHeight - 100) + 50
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const opacity = Math.random() * 0.15 + 0.05 // Very subtle
      
      let shapeStyles = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        opacity: ${opacity};
        transition: all 0.3s ease;
      `

      // Professional color palette - muted greens and blues
      const colors = [
        'rgba(34, 197, 94, 0.1)',   // Soft green
        'rgba(16, 185, 129, 0.1)',  // Emerald
        'rgba(59, 130, 246, 0.1)',  // Blue
        'rgba(99, 102, 241, 0.1)',  // Indigo
        'rgba(34, 197, 94, 0.08)',  // Light green
        'rgba(6, 182, 212, 0.1)'    // Cyan
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]

      switch(shapeType.type) {
        case 'circle':
          shapeStyles += `
            border-radius: 50%;
            background: linear-gradient(135deg, ${color}, transparent);
            border: 1px solid rgba(34, 197, 94, 0.1);
          `
          break
        case 'square':
          shapeStyles += `
            background: linear-gradient(45deg, ${color}, transparent);
            border: 1px solid rgba(59, 130, 246, 0.1);
            transform: rotate(45deg);
          `
          break
        case 'triangle':
          shapeStyles += `
            width: 0;
            height: 0;
            border-left: ${size/2}px solid transparent;
            border-right: ${size/2}px solid transparent;
            border-bottom: ${size}px solid ${color};
          `
          break
        case 'hexagon':
          shapeStyles += `
            background: ${color};
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            border: 1px solid rgba(16, 185, 129, 0.1);
          `
          break
        case 'diamond':
          shapeStyles += `
            background: ${color};
            transform: rotate(45deg);
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          `
          break
        case 'pentagon':
          shapeStyles += `
            background: ${color};
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
          `
          break
      }
      
      shape.style.cssText = shapeStyles
      shape.setAttribute('data-shape-type', shapeType.name)
      container.appendChild(shape)
      geometricShapes.push(shape)
    }

    // Animation loop for particles
    const animateParticles = () => {
      minimalParticles.forEach((particle, index) => {
        particle.update()
        const element = particleElements[index]
        if (element) {
          const pulse = Math.sin(particle.pulsePhase) * 0.2 + 0.8
          element.style.left = particle.x + 'px'
          element.style.top = particle.y + 'px'
          element.style.opacity = particle.opacity * pulse
          element.style.transform = `scale(${pulse})`
        }
      })
      requestAnimationFrame(animateParticles)
    }

    // GSAP animations for professional floating effects
    const ctx_gsap = gsap.context(() => {
      // Subtle particle movements
      particleElements.forEach((element, index) => {
        gsap.to(element, {
          y: `+=${Math.random() * 100 - 50}`,
          x: `+=${Math.random() * 100 - 50}`,
          duration: Math.random() * 20 + 15, // Slow, elegant movement
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3
        })
      })

      // Professional geometric shape animations
      geometricShapes.forEach((shape, index) => {
        // Gentle floating animation
        gsap.to(shape, {
          y: `+=${Math.random() * 80 - 40}`,
          x: `+=${Math.random() * 60 - 30}`,
          duration: Math.random() * 25 + 20, // Very slow movement
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 1
        })

        // Subtle rotation
        gsap.to(shape, {
          rotation: Math.random() * 360,
          duration: Math.random() * 40 + 30, // Very slow rotation
          repeat: -1,
          ease: "none",
          delay: Math.random() * 5
        })

        // Gentle scale breathing effect
        gsap.to(shape, {
          scale: Math.random() * 0.3 + 0.9, // Minimal scale change
          duration: Math.random() * 8 + 6,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: Math.random() * 3
        })

        // Very subtle opacity pulsing
        gsap.to(shape, {
          opacity: Math.random() * 0.1 + 0.05,
          duration: Math.random() * 6 + 4,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: Math.random() * 4
        })
      })

      // Minimal mouse interaction - subtle attraction
      const handleMouseMove = (e) => {
        const mouseX = e.clientX
        const mouseY = e.clientY

        geometricShapes.forEach((shape) => {
          const rect = shape.getBoundingClientRect()
          const shapeX = rect.left + rect.width / 2
          const shapeY = rect.top + rect.height / 2
          
          const distance = Math.sqrt(
            Math.pow(mouseX - shapeX, 2) + Math.pow(mouseY - shapeY, 2)
          )
          
          // Very subtle interaction only when very close
          if (distance < 150) {
            const force = (150 - distance) / 150 * 0.2 // Minimal force
            gsap.to(shape, {
              scale: 1 + force * 0.3,
              opacity: shape.style.opacity * (1 + force * 0.5),
              duration: 0.6,
              ease: "power2.out"
            })
          }
        })
      }

      // Throttled mouse move for better performance
      let mouseTimeout
      const throttledMouseMove = (e) => {
        clearTimeout(mouseTimeout)
        mouseTimeout = setTimeout(() => handleMouseMove(e), 16) // ~60fps
      }

      window.addEventListener('mousemove', throttledMouseMove)

      // Handle window resize
      const handleResize = () => {
        // Reposition elements that might be outside viewport
        geometricShapes.forEach(shape => {
          const rect = shape.getBoundingClientRect()
          if (rect.left > window.innerWidth || rect.top > window.innerHeight) {
            gsap.set(shape, {
              x: Math.random() * (window.innerWidth - 100) + 50,
              y: Math.random() * (window.innerHeight - 100) + 50
            })
          }
        })
      }

      window.addEventListener('resize', handleResize)

      return () => {
        clearTimeout(mouseTimeout)
        window.removeEventListener('mousemove', throttledMouseMove)
        window.removeEventListener('resize', handleResize)
      }

    }, container)

    // Start particle animation
    animateParticles()

    // Cleanup
    return () => {
      ctx_gsap.revert()
      particleElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
      geometricShapes.forEach(shape => {
        if (shape.parentNode) {
          shape.parentNode.removeChild(shape)
        }
      })
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.02) 0%, 
            rgba(34, 197, 94, 0.015) 25%, 
            rgba(59, 130, 246, 0.01) 50%, 
            rgba(16, 185, 129, 0.015) 75%, 
            transparent 100%
          )
        `,
      }}
    >
      {/* Subtle gradient overlays with smooth transitions */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-blue-50/20 animate-pulse" 
           style={{ animationDuration: '12s' }} />
      
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-50/15 to-transparent animate-pulse" 
           style={{ animationDuration: '18s', animationDelay: '6s' }} />
      
      {/* Professional grid overlay - very subtle */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          animation: 'backgroundShift 60s linear infinite'
        }} />
      </div>

      {/* Ambient lighting effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-green-200/5 to-transparent rounded-full blur-3xl animate-pulse"
           style={{ animationDuration: '20s' }} />
      
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-radial from-blue-200/5 to-transparent rounded-full blur-3xl animate-pulse"
           style={{ animationDuration: '25s', animationDelay: '10s' }} />
    </div>
  )
}