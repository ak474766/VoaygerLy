'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ServiceProviderDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [providerData, setProviderData] = useState(null)
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (isLoaded && user) {
      fetchProviderData()
      fetchBookings()
      fetchReviews()
    }
  }, [isLoaded, user])

  const fetchProviderData = async () => {
    try {
      const response = await fetch('/api/service-provider/register', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        setProviderData(data.provider)
      } else {
        // If no provider profile found, redirect to setup
        router.push('/service-provider/setup')
      }
    } catch (error) {
      console.error('Error fetching provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/my')
      if (response.ok) {
        const data = await response.json()
        // Filter bookings where this user is the service provider
        const providerBookings = (data.data || []).filter(booking => 
          String(booking.serviceProviderId) === String(providerData?._id)
        )
        setBookings(providerBookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      if (providerData?._id) {
        const response = await fetch(`/api/reviews?providerId=${providerData._id}`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleBookingAction = async (bookingId, action, notes = '') => {
    try {
      const response = await fetch('/api/bookings/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, action, notes })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message || `Booking ${action}ed successfully`)
        fetchBookings() // Refresh bookings
        fetchProviderData() // Refresh stats
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Booking action error:', error)
      alert('Error performing action')
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 ${
            i <= Math.floor(rating || 0)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        >
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
        </svg>
      )
    }
    return stars
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
                  Welcome, {providerData?.businessName || user?.fullName}
                </h1>
                <p className="text-sm text-gray-500">Service Provider Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                providerData?.verificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {providerData?.verificationStatus || 'Pending'}
              </span>
              <button
                onClick={() => router.push('/home')}
                className="text-indigo-600 hover:text-indigo-500"
              >
                View as Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'bookings', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📋</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {providerData?.stats?.totalBookings || 0}
                    </p>
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
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {providerData?.stats?.completedBookings || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⭐</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {providerData?.rating?.average?.toFixed(1) || '0.0'}
                    </p>
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
                    <p className="text-sm font-medium text-gray-500">Earnings</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ₹{providerData?.stats?.totalEarnings || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/service-provider/setup')}
                    className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
                  >
                    Update Profile
                  </button>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
                  >
                    Manage Bookings
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
                  >
                    View Reviews
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-sm text-gray-500">
                  {bookings.length > 0 ? (
                    <div className="space-y-2">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking._id} className="flex justify-between">
                          <span className="truncate">{booking.description}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No recent activity</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Complete</span>
                    <span className="text-sm font-medium text-green-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Photos</span>
                    <span className={`text-sm font-medium ${
                      providerData?.photos?.length > 0 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {providerData?.photos?.length > 0 ? '✓' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Verification</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {providerData?.verificationStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Categories */}
            {providerData?.categories && providerData.categories.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Services</h3>
                <div className="flex flex-wrap gap-2">
                  {providerData.categories.map(category => (
                    <span
                      key={category}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm capitalize"
                    >
                      {category.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Manage Bookings</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No bookings yet. Your bookings will appear here.
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{booking.description}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.serviceLocation?.address}, {booking.serviceLocation?.city}
                        </p>
                        <p className="text-sm font-medium text-green-600 mt-2">
                          ₹{booking.pricing?.totalAmount} ({booking.payment?.method?.toUpperCase()})
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'accept')}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleBookingAction(booking._id, 'decline')}
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleBookingAction(booking._id, 'start')}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Start Service
                            </button>
                          )}
                          {booking.status === 'in-progress' && (
                            <button
                              onClick={() => handleBookingAction(booking._id, 'complete', 'Service completed successfully')}
                              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {reviews.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No reviews yet. Reviews from customers will appear here.
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm font-medium text-gray-900">{review.rating}/5</span>
                        </div>
                        {review.title && <h4 className="font-medium text-gray-900">{review.title}</h4>}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="text-gray-700 mb-3">{review.comment}</p>}
                    {review.detailedRating && Object.keys(review.detailedRating).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                        {Object.entries(review.detailedRating).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="font-medium">{value}/5</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
