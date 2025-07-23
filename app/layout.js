import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MewShop - Products, Tools & Finance Solutions",
  description: "Your ultimate destination for products, tools, and financial solutions. Discover amazing deals, powerful utilities, and expert insights all in one place.",
  keywords: "ecommerce, online shopping, tools, finance, calculator, budget, investment",
  author: "MewShop",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Dark mode initialization script to prevent flash
              (function() {
                function getThemePreference() {
                  if (typeof localStorage !== 'undefined' && localStorage.getItem('darkMode')) {
                    return localStorage.getItem('darkMode') === 'true';
                  }
                  return window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                if (getThemePreference()) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors duration-200 overflow-x-hidden`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="min-h-screen overflow-x-hidden pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
