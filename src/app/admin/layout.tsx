"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useAdminCheck } from "@/context/admin"
import { Sidebar } from "@/components/admin/sidebar"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, isLoaded: userLoaded, user } = useUser()
  const { isAdmin, isLoading: adminLoading } = useAdminCheck()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start closed on mobile, will be handled by useEffect

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true) // Always open on desktop
      } else {
        setSidebarOpen(false) // Closed on mobile by default
      }
    }

    // Set initial state
    handleResize()
    
    // Listen for resize events
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!userLoaded || adminLoading) {
      return
    }
    if (!isSignedIn) {
      router.push("/signin?redirect_url=" + encodeURIComponent(window.location.pathname))
      return
    }
    if (isSignedIn && !isAdmin) {
      router.push("/unauthorized")
      return
    }
  }, [isSignedIn, isAdmin, userLoaded, adminLoading, router])
  if (!userLoaded || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 absolute inset-0">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }
  if (!isSignedIn || !isAdmin) {
    return null
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main content with proper spacing for desktop sidebar */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen && "lg:ml-72" // Add left margin when sidebar is open on desktop
      )}>
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Hamburger menu button for mobile */}
            <div className="mb-4 lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
