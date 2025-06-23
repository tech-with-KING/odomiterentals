"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useAdminCheck } from "@/context/admin"
import { Sidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, isLoaded: userLoaded, user } = useUser()
  const { isAdmin, isLoading: adminLoading } = useAdminCheck()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
      <div className="">
         <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
