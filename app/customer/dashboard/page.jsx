'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CustomerDashboard() {
  const { user } = useUser()
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: '🏠' },
    { id: 'plumber', name: 'Plumber', icon: '🔧' },
    { id: 'electrician', name: 'Electrician', icon: '⚡' },
    { id: 'cleaner', name: 'Cleaner', icon: '🧹' },
    { id: 'carpenter', name: 'Carpenter', icon: '🔨' },
    { id: 'painter', name: 'Painter', icon: '🎨' },
    { id: 'mechanic', name: 'Mechanic', icon: '🔩' },
    { id: 'gardener', name: 'Gardener', icon: '🌱' },
    { id: 'appliance-repair', name: 'Appliance Repair', icon: '🔌' },
    { id: 'pest-control', name: 'Pest Control', icon: '🐛' },
    { id: 'ac-repair', name: 'AC Repair', icon: '❄️' },
    { id: 'home-security', name: 'Home Security', icon: '🔒' }
  ]

  useEffect(() => {
    fetchServices()
  }, [selectedCategory])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const url = selectedCategory === 'all' 
        ? '/api/services'
        : `/api/services?category=${selectedCategory}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
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
                  Welcome, {user?.fullName}
                </h1>
                <p className="text-sm text-gray-500">Find the best service providers near you</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/customer/bookings"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Book Trusted Service Providers
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            From plumbing to painting, find verified professionals for all your home service needs
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for services..."
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-r-lg font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Service Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {serviceCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                selectedCategory === category.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            {selectedCategory === 'all' ? 'All Services' : `${serviceCategories.find(c => c.id === selectedCategory)?.name} Services`}
          </h3>
          <div className="text-sm text-gray-500">
            {services.length} services found
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                  <span className="text-4xl text-white">
                    {serviceCategories.find(c => c.id === service.category)?.icon || '🔧'}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                      {service.category.replace('-', ' ')}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {service.rating?.average?.toFixed(1) || '0.0'} ({service.rating?.count || 0})
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-indigo-600">
                      {service.pricing?.type === 'hourly' 
                        ? `₹${service.pricing.hourlyRate}/hr`
                        : `₹${service.pricing.fixedPrice}`
                      }
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Book Now
                    </button>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    by {service.serviceProviderId?.businessName || 'Service Provider'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && services.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Try selecting a different category or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
