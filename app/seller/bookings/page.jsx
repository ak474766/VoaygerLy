'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function SellerBookings() {
  const { user } = useUser()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const bookingStatuses = [
    { id: 'all', name: 'All Bookings', count: 0 },
    { id: 'pending', name: 'Pending', count: 0 },
    { id: 'confirmed', name: 'Confirmed', count: 0 },
    { id: 'in-progress', name: 'In Progress', count: 0 },
    { id: 'completed', name: 'Completed', count: 0 },
    { id: 'cancelled', name: 'Cancelled', count: 0 }
  ]

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      // This would fetch bookings from API
      // For now, using mock data
      const mockBookings = [
        {
          _id: '1',
          bookingId: 'BK1234567890',
          userId: 'user1',
          serviceType: 'Home Cleaning',
          scheduledDate: '2024-01-20',
          scheduledTime: '10:00',
          status: 'pending',
          pricing: { totalAmount: 2000 },
          serviceLocation: { address: '123 Main St, Mumbai' },
          customerName: 'John Doe',
          customerPhone: '+91 9876543210'
        },
        {
          _id: '2',
          bookingId: 'BK1234567891',
          userId: 'user2',
          serviceType: 'Plumbing Repair',
          scheduledDate: '2024-01-21',
          scheduledTime: '14:00',
          status: 'confirmed',
          pricing: { totalAmount: 1500 },
          serviceLocation: { address: '456 Oak Ave, Mumbai' },
          customerName: 'Jane Smith',
          customerPhone: '+91 9876543211'
        }
      ]
      setBookings(mockBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      // API call to update booking status
      console.log('Updating booking status:', bookingId, newStatus)
      // Refresh bookings after update
      fetchBookings()
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Service Bookings</h1>
              <p className="text-sm text-gray-500">Manage your service bookings and appointments</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredBookings.length} bookings
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {bookingStatuses.map(status => (
                <button
                  key={status.id}
                  onClick={() => setFilter(status.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === status.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {status.name}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {status.id === 'all' ? bookings.length : bookings.filter(b => b.status === status.id).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'You don\'t have any bookings yet.' 
                : `No ${filter} bookings at the moment.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-gray-900">
                        #{booking.bookingId}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-indigo-600">
                      ₹{booking.pricing.totalAmount}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Service</p>
                      <p className="text-gray-900">{booking.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Customer</p>
                      <p className="text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-500">{booking.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date & Time</p>
                      <p className="text-gray-900">{booking.scheduledDate}</p>
                      <p className="text-sm text-gray-500">{booking.scheduledTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900 text-sm">{booking.serviceLocation.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking.bookingId, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking.bookingId, 'cancelled')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.bookingId, 'in-progress')}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Start Service
                        </button>
                      )}
                      {booking.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(booking.bookingId, 'completed')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                        Message Customer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
