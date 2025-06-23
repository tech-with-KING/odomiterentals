// hooks/useAdminCheck.ts

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

interface AdminDetails {
  name: string
  privilege: 'dev' | 'admin'
  email: string
}

export function useAdminCheck() {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminDetails, setAdminDetails] = useState<AdminDetails | undefined>(undefined)

  const checkAdminStatus = async () => {
    console.log('🔁 Running checkAdminStatus...')

    if (!user) {
      console.warn('❌ No user found from Clerk.')
      setIsAdmin(false)
      setAdminDetails(undefined)
      setIsLoading(false)
      return
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress
    console.log('📨 Clerk user email:', userEmail)

    if (!userEmail) {
      console.warn('❌ No email found for Clerk user.')
      setIsAdmin(false)
      setAdminDetails(undefined)
      setIsLoading(false)
      return
    }

    try {
      const adminCollectionRef = collection(db, 'admin')
      console.log('📁 Firestore admin collection ref:', adminCollectionRef.path)

      const q = query(adminCollectionRef, where('email', '==', userEmail))
      console.log('🔍 Firestore query created:', q)

      const querySnapshot = await getDocs(q)
      console.log('📊 Query snapshot size:', querySnapshot.size)

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const adminDoc = doc.data()
        console.log('✅ Firestore admin document found:', adminDoc)

        const details: AdminDetails = {
          name: adminDoc.name,
          privilege: adminDoc.privilege,
          email: userEmail
        }

        setIsAdmin(true)
        setAdminDetails(details)
        console.log('✅ Admin status set to true with details:', details)
      } else {
        console.warn('⚠️ No admin record found for this email.')
        setIsAdmin(false)
        setAdminDetails(undefined)
      }
    } catch (error) {
      console.error('🔥 Error while checking Firestore admin status:', error)
      setIsAdmin(false)
      setAdminDetails(undefined)
    } finally {
      setIsLoading(false)
      console.log('✅ Admin status check completed.')
    }
  }

  useEffect(() => {
    if (!isLoaded) {
      console.log('⏳ Clerk user not loaded yet.')
      return
    }

    console.log('🧠 Clerk user loaded. Starting admin check.')
    checkAdminStatus()
  }, [isLoaded, user?.emailAddresses])

  return {
    isAdmin,
    isLoading,
    adminDetails,
    refetch: checkAdminStatus
  }
}
