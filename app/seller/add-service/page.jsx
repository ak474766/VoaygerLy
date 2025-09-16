'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function AddService() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    pricing: {
      type: 'hourly',
      hourlyRate: '',
      fixedPrice: '',
      minimumCharge: ''
    },
    serviceAreas: [{
      city: '',
      areas: [''],
      radiusKm: 10
    }],
    availability: {
      isAvailable: true,
      workingDays: [],
      timeSlotDuration: 60,
      advanceBookingDays: 30
    },
    features: [''],
    requirements: [''],
    tools: [''],
    tags: ['']
  })

  const serviceCategories = [
    { id: 'plumber', name: 'Plumber' },
    { id: 'electrician', name: 'Electrician' },
    { id: 'cleaner', name: 'Cleaner' },
    { id: 'carpenter', name: 'Carpenter' },
    { id: 'painter', name: 'Painter' },
    { id: 'mechanic', name: 'Mechanic' },
    { id: 'gardener', name: 'Gardener' },
    { id: 'appliance-repair', name: 'Appliance Repair' },
    { id: 'pest-control', name: 'Pest Control' },
    { id: 'ac-repair', name: 'AC Repair' },
    { id: 'home-security', name: 'Home Security' },
    { id: 'other', name: 'Other' }
  ]

  const workingDays = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ]

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleArrayAdd = (field, value = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }))
  }

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleArrayUpdate = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const handleWorkingDayChange = (day) => {
    const existingDay = formData.availability.workingDays.find(wd => wd.day === day)
    
    if (existingDay) {
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          workingDays: prev.availability.workingDays.filter(wd => wd.day !== day)
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          workingDays: [...prev.availability.workingDays, {
            day,
            startTime: '09:00',
            endTime: '18:00',
            isAvailable: true
          }]
        }
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim()),
          requirements: formData.requirements.filter(r => r.trim()),
          tools: formData.tools.filter(t => t.trim()),
          tags: formData.tags.filter(t => t.trim())
        }),
      })

      if (response.ok) {
        router.push('/seller/dashboard')
      } else {
        alert('Error creating service')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating service')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Service</h1>
            <p className="text-gray-600">Create a new service listing for your customers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Professional Home Cleaning Service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your service in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select a category</option>
                    {serviceCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Deep Cleaning, Pipe Repair"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Pricing</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing Type *
                </label>
                <select
                  required
                  value={formData.pricing.type}
                  onChange={(e) => handleInputChange('pricing.type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="hourly">Hourly Rate</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(formData.pricing.type === 'hourly' || formData.pricing.type === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate (₹) *
                    </label>
                    <input
                      type="number"
                      required={formData.pricing.type === 'hourly'}
                      value={formData.pricing.hourlyRate}
                      onChange={(e) => handleInputChange('pricing.hourlyRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="500"
                    />
                  </div>
                )}

                {(formData.pricing.type === 'fixed' || formData.pricing.type === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fixed Price (₹) *
                    </label>
                    <input
                      type="number"
                      required={formData.pricing.type === 'fixed'}
                      value={formData.pricing.fixedPrice}
                      onChange={(e) => handleInputChange('pricing.fixedPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="2000"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.pricing.minimumCharge}
                    onChange={(e) => handleInputChange('pricing.minimumCharge', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="200"
                  />
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Service Areas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.serviceAreas[0].city}
                    onChange={(e) => {
                      const newAreas = [...formData.serviceAreas]
                      newAreas[0].city = e.target.value
                      setFormData(prev => ({ ...prev, serviceAreas: newAreas }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Radius (km)
                  </label>
                  <input
                    type="number"
                    value={formData.serviceAreas[0].radiusKm}
                    onChange={(e) => {
                      const newAreas = [...formData.serviceAreas]
                      newAreas[0].radiusKm = parseInt(e.target.value)
                      setFormData(prev => ({ ...prev, serviceAreas: newAreas }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            {/* Working Days */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Availability</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {workingDays.map(day => (
                  <label key={day} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability.workingDays.some(wd => wd.day === day)}
                      onChange={() => handleWorkingDayChange(day)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Service Features</h2>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayUpdate('features', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 24/7 Emergency Service"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('features', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('features')}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/seller/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
