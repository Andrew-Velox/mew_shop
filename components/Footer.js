'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  // GSAP refs
  const footerRef = useRef(null)
  const footerLinksRef = useRef([])
  const socialLinksRef = useRef([])

  // GSAP Footer Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Footer links animation
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.fromTo(footerLinksRef.current,
            { y: 30, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.6, 
              stagger: 0.1, 
              ease: "power2.out",
              delay: 0.2
            }
          )

          gsap.fromTo(socialLinksRef.current,
            { scale: 0, rotation: 180 },
            { 
              scale: 1, 
              rotation: 0, 
              duration: 0.8, 
              stagger: 0.1, 
              ease: "back.out(1.7)",
              delay: 0.5
            }
          )
        }
      })

    }, footerRef)

    return () => ctx.revert()
  }, [])

  const footerSections = [
    {
      title: 'Products',
      links: [
        { name: 'Electronics', href: '/products/electronics' },
        { name: 'Home & Garden', href: '/products/home-garden' },
        { name: 'Fashion', href: '/products/fashion' },
        { name: 'All Products', href: '/products' }
      ]
    },
    {
      title: 'Tools',
      links: [
        { name: 'Design Tools', href: '/tools/design' },
        { name: 'Developer Tools', href: '/tools/developer' },
        { name: 'Marketing Tools', href: '/tools/marketing' },
        { name: 'All Tools', href: '/tools' }
      ]
    },
    {
      title: 'Finance',
      links: [
        { name: 'Budget Calculator', href: '/finance-tools/budget' },
        { name: 'Investment Tracker', href: '/finance-tools/investment' },
        { name: 'Loan Calculator', href: '/finance-tools/loan' },
        { name: 'All Finance Tools', href: '/finance-tools' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Shipping Info', href: '/shipping' },
        { name: 'Returns', href: '/returns' },
        { name: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ]

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'LinkedIn', href: '#', icon: '💼' }
  ]

  return (
    <footer 
      ref={footerRef}
      className="bg-gray-900 text-white"
    >
      {/* Main Footer */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Mew<span className="text-green-400">Shop</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your sustainable destination for eco-friendly products, innovative tools, and smart financial solutions.
              </p>
              
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Link 
                    key={social.name}
                    ref={(el) => {
                      if (el && !socialLinksRef.current.includes(el)) {
                        socialLinksRef.current[index] = el
                      }
                    }}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <div 
                key={section.title}
                ref={(el) => {
                  if (el && !footerLinksRef.current.includes(el)) {
                    footerLinksRef.current[sectionIndex] = el
                  }
                }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {currentYear} MewShop. All rights reserved. Built with sustainability in mind.
              </p>
              <div className="flex space-x-6 text-sm">
                <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Terms
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Privacy
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-green-400 transition-colors duration-200">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
