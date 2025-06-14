"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function NotFoundPage() {
  const [countdown, setCountdown] = useState(20)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      
      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-2xl">
        <Image
            src={'https://static.vecteezy.com/system/resources/previews/031/974/996/non_2x/modern-illustration-of-404-error-page-template-for-website-electric-plug-and-socket-unplugged-concept-of-electrical-theme-web-banner-disconnection-loss-of-connect-yellow-vector.jpg'}
            alt='notfoundimage'
            fill
            unoptimized
            className="object-cover  rounded-2xl"
            priority={true}
        />
    </div>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 my-4">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            The page you are looking for does not exist or has been moved. Please use the search bar below or navigate to one of the links provided to find what you need.
          </p>
          
          {/* Countdown Timer */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg inline-block">
            <p className="text-blue-700 font-medium">
              Redirecting to homepage in <span className="font-bold text-blue-900">{countdown}</span> seconds
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-lg mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products"
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={handleGoBack}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors duration-200 font-medium border-0 min-w-[160px]"
            >
              Go Back
            </button>
            <Link href="/">
              <button className="px-8 py-3 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 transition-colors duration-200 font-medium border-0 min-w-[160px]">
                Go to Homepage
              </button>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-gray-600">
            <Link href="/products" className="hover:text-gray-900 transition-colors duration-200 font-medium">
              Browse Products
            </Link>
            <Link href="/services" className="hover:text-gray-900 transition-colors duration-200 font-medium">
              Our Services
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors duration-200 font-medium">
              Contact Us
            </Link>
            <Link href="/help" className="hover:text-gray-900 transition-colors duration-200 font-medium">
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}