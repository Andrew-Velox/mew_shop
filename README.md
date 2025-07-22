# MewShop - Modern E-commerce & Tools Platform

A modern, responsive Next.js website featuring a comprehensive navbar, beautiful homepage, and SEO-optimized structure ready for Django API integration.

## 🚀 Features

### ✨ Modern Navbar
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **MewShop Logo**: Custom gradient logo with hover effects
- **Smart Search Bar**: Full-width search with focus animations
- **Navigation Menu**: Home, Products, Blog, Tools, Finance Tools, About
- **Dark Mode Toggle**: Persistent theme switching with smooth transitions
- **Authentication**: Login/Signup buttons + user profile dropdown when logged in
- **Mobile Menu**: Collapsible hamburger menu with smooth animations
- **SEO Friendly**: Semantic HTML structure and proper meta tags

### 🏠 Homepage Components
- **Hero Section**: Gradient background with animated blobs and compelling CTA buttons
- **Featured Sections**: Four main service areas with icons and hover effects
- **Statistics**: User count, products, tools display
- **Newsletter Signup**: Email subscription form with gradient styling

### 🎨 Design & UX
- **Tailwind CSS**: Utility-first styling with custom animations
- **Dark Mode**: Complete dark/light theme support
- **Smooth Transitions**: All interactions have smooth hover/focus effects
- **Accessibility**: Proper focus states, ARIA labels, semantic HTML
- **Performance**: Optimized images, fonts, and animations

## 🛠️ Tech Stack

- **Next.js 15.4.2** - React framework with App Router
- **React 19.1.0** - Latest React with modern hooks
- **Tailwind CSS 4** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

## 🔧 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔗 Django API Integration Points

The following components are ready for your Django API integration:

### Authentication
- `components/Navbar.js` - Login state management
- `app/login/page.js` - Login form
- `app/signup/page.js` - Registration form

### Content Pages
- `app/products/page.js` - Product listings and details
- `app/blog/page.js` - Blog posts and articles
- `app/tools/page.js` - Tool listings
- `app/finance-tools/page.js` - Financial calculators
- `app/search/page.js` - Search functionality

---

**Built with ❤️ for modern e-commerce and productivity tools**
