'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RoleBasedNavigation() {
  const { user, isLoaded } = useUser()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserRole()
    } else if (isLoaded) {
      setLoading(false)
    }
  }, [isLoaded, user])

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        setUserRole(data.user?.role)
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">Voyagerly</span>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const navigationItems = {
    user: [
      { name: 'Home', href: '/home' },
      { name: 'Find Services', href: '/home/all-products' },
      { name: 'My Bookings', href: '/bookings' },
      { name: 'Messages', href: '/messages' },
    ],
    serviceProvider: [
      { name: 'Dashboard', href: '/service-provider/dashboard' },
      { name: 'My Services', href: '/service-provider/services' },
      { name: 'Bookings', href: '/service-provider/bookings' },
      { name: 'Messages', href: '/service-provider/messages' },
      { name: 'Earnings', href: '/service-provider/earnings' },
    ],
    admin: [
      { name: 'Admin Dashboard', href: '/admin/dashboard' },
      { name: 'Users', href: '/admin/users' },
      { name: 'Service Providers', href: '/admin/providers' },
      { name: 'Bookings', href: '/admin/bookings' },
      { name: 'Reports', href: '/admin/reports' },
    ]
  }

  const currentNavItems = navigationItems[userRole] || navigationItems.user

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="text-xl font-bold text-indigo-600">
              Voyagerly
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            {currentNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Role Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userRole === 'serviceProvider' 
                    ? 'bg-green-100 text-green-800' 
                    : userRole === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userRole === 'serviceProvider' ? 'Provider' : 
                   userRole === 'admin' ? 'Admin' : 'Customer'}
                </span>

                {/* Role Switch */}
                {userRole === 'serviceProvider' && (
                  <button
                    onClick={() => router.push('/home')}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View as Customer
                  </button>
                )}

                {/* User Avatar */}
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.imageUrl}
                  alt={user.fullName}
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
