// hooks/useAdminCheck.ts

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

export function useAdminCheck() {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const checkAdminStatus = useCallback(async () => {
    setIsLoading(true)
    try {
      if (!user || !user.emailAddresses?.[0]?.emailAddress) {
        setIsAdmin(false)
        return
      }

      const userEmail = user.emailAddresses[0].emailAddress
      
      // Use API route to check admin status
      const response = await fetch('/api/check-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } else {
        console.error('Failed to check admin status:', response.statusText)
        setIsAdmin(false)
      }
    } catch (err) {
      console.error('Error checking admin status:', err)
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (isLoaded) checkAdminStatus()
  }, [isLoaded, checkAdminStatus])

  return { isAdmin, isLoading, refetch: checkAdminStatus }
}
