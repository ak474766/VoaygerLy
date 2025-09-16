'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children, allowedRoles = ['user', 'serviceProvider', 'admin'] }) {
  const { user, isLoaded } = useUser()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push('/sign-in')
        return
      }
      checkUserRole()
    }
  }, [isLoaded, user])

  const checkUserRole = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        const role = data.user?.role || 'user'
        setUserRole(role)
        
        if (allowedRoles.includes(role)) {
          setAuthorized(true)
        } else {
          // Redirect based on role
          switch (role) {
            case 'serviceProvider':
              router.push('/service-provider/dashboard')
              break
            case 'admin':
              router.push('/admin/dashboard')
              break
            default:
              router.push('/home')
          }
        }
      } else {
        router.push('/sign-in')
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      router.push('/sign-in')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/home')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return children
}
