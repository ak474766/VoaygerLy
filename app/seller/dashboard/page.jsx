'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SellerDashboard() {
  const { user } = useUser()
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    rating: 0
  })
  const [loading, setLoading] = useState(true)
  const [showAddService, setShowAddService] = useState(false)

  useEffect(() => {
    fetchSellerData()
  }, [])

  const fetchSellerData = async () => {
    try {
      setLoading(true)
      // Fetch seller's services
      const servicesResponse = await fetch('/api/services?providerId=current')
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setServices(servicesData.services)
        setStats(prev => ({
          ...prev,
          totalServices: servicesData.services.length,
          activeServices: servicesData.services.filter(s => s.status === 'active').length
        }))
      }
    } catch (error) {
      console.error('Error fetching seller data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleServiceToggle = async (serviceId, newStatus) => {
    try {
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, status: newStatus })
      })
      
      if (response.ok) {
        fetchSellerData()
      }
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img
                className="h-10 w-10 rounded-full"
                src={user?.imageUrl}
                alt={user?.fullName}
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Seller Dashboard
                </h1>
                <p className="text-sm text-gray-500">Manage your services and bookings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/customer/dashboard"
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                View as Customer
              </Link>
              <button
                onClick={() => setShowAddService(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add New Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Services</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Services</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">₹</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">₹{stats.totalEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Service Bookings</h3>
              <p className="text-sm text-gray-500">Manage your service bookings</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  href="/seller/bookings"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">All Bookings</h4>
                      <p className="text-sm text-gray-500">View and manage all your bookings</p>
                    </div>
                    <span className="text-indigo-600">→</span>
                  </div>
                </Link>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Pending Bookings</h4>
                      <p className="text-sm text-gray-500">{stats.pendingBookings} pending requests</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {stats.pendingBookings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Service */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Add New Service</h3>
              <p className="text-sm text-gray-500">Create and list new services</p>
            </div>
            <div className="p-6">
              <Link
                href="/seller/add-service"
                className="block w-full"
              >
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                  <div className="text-4xl mb-4">➕</div>
                  <h4 className="font-medium text-gray-900 mb-2">Create New Service</h4>
                  <p className="text-sm text-gray-500">Add a new service to your portfolio</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Reviews and Messages */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Reviews & Messages</h3>
              <p className="text-sm text-gray-500">Customer feedback and communications</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  href="/seller/reviews"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Customer Reviews</h4>
                      <p className="text-sm text-gray-500">View and respond to reviews</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="text-sm text-gray-600">{stats.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/seller/messages"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Messages</h4>
                      <p className="text-sm text-gray-500">Chat with customers</p>
                    </div>
                    <span className="text-indigo-600">→</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* My Services */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">My Services</h3>
              <p className="text-sm text-gray-500">Manage your listed services</p>
            </div>
            <div className="p-6">
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📝</div>
                  <h4 className="font-medium text-gray-900 mb-2">No services listed yet</h4>
                  <p className="text-sm text-gray-500 mb-4">Create your first service to start receiving bookings</p>
                  <Link
                    href="/seller/add-service"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Add Your First Service
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(service => (
                    <div key={service._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded capitalize ${
                          service.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.status}
                        </span>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                          {service.category.replace('-', ' ')}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{service.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-indigo-600">
                          {service.pricing?.type === 'hourly' 
                            ? `₹${service.pricing.hourlyRate}/hr`
                            : `₹${service.pricing.fixedPrice}`
                          }
                        </div>
                        <button
                          onClick={() => handleServiceToggle(service.serviceId, 
                            service.status === 'active' ? 'inactive' : 'active'
                          )}
                          className={`text-xs px-3 py-1 rounded ${
                            service.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {service.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
