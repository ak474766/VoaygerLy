'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AdminDashboard() {
  const { user } = useUser()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingProviders: 0,
    completionRate: 0
  })
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchStats()
    fetchProviders()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.data.overview)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/admin/providers?status=pending')
      if (response.ok) {
        const data = await response.json()
        setProviders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
    }
  }

  const handleProviderAction = async (providerId, status, notes = '') => {
    try {
      const response = await fetch('/api/admin/providers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, verificationStatus: status, notes })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message || `Provider ${status} successfully`)
        fetchProviders() // Refresh providers list
        fetchStats() // Refresh stats
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Provider action error:', error)
      alert('Error performing action')
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['admin']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
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
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">Welcome back, {user?.fullName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'providers', 'users'].map((tab) => (
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
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">👥</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">🔧</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Service Providers</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalProviders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">📋</span>
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
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900">₹{stats.totalRevenue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="text-sm font-medium text-green-600">{stats.completionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending Verifications</span>
                      <span className="text-sm font-medium text-yellow-600">{stats.pendingProviders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Providers</span>
                      <span className="text-sm font-medium text-blue-600">{stats.totalProviders}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('providers')}
                      className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
                    >
                      Review Provider Applications
                    </button>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
                    >
                      Manage Users
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md">
                      View Reports
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• {stats.pendingProviders} providers awaiting verification</p>
                    <p>• {stats.totalBookings} total bookings processed</p>
                    <p>• ₹{stats.totalRevenue} total platform revenue</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'providers' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Provider Verification</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {providers.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No pending provider verifications.
                  </div>
                ) : (
                  providers.map((provider) => (
                    <div key={provider._id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{provider.businessName}</h4>
                          <p className="text-sm text-gray-600 mt-1">{provider.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {provider.categories?.map((category) => (
                              <span
                                key={category}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs capitalize"
                              >
                                {category.replace('-', ' ')}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Pricing:</strong> ₹{provider.pricing?.hourlyRate}/hr
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Applied:</strong> {new Date(provider.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {provider.verificationStatus}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleProviderAction(provider._id, 'verified', 'Approved by admin')}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleProviderAction(provider._id, 'rejected', 'Rejected by admin')}
                              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
              <p className="text-gray-600">User management features will be implemented here.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">Total Users</h4>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">Service Providers</h4>
                  <p className="text-2xl font-bold text-green-600">{stats.totalProviders}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
