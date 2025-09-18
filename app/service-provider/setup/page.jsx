'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'

export default function ServiceProviderSetup() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    categories: [],
    skills: [],
    pricing: {
      type: 'hourly',
      hourlyRate: '',
      currency: 'INR'
    },
    serviceAreas: [],
    availability: {
      workingDays: [],
      timeSlotDuration: 60,
      advanceBookingDays: 30
    },
    photos: []
  })

  const serviceCategories = [
    'plumber', 'electrician', 'cleaner', 'carpenter', 
    'painter', 'mechanic', 'gardener', 'appliance-repair',
    'pest-control', 'ac-repair', 'home-security', 'other'
  ]

  const workingDays = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ]

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const handleSkillAdd = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
    }
  }

  const handleSkillRemove = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const handleWorkingDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        workingDays: prev.availability.workingDays.some(wd => wd.day === day)
          ? prev.availability.workingDays.filter(wd => wd.day !== day)
          : [...prev.availability.workingDays, {
              day,
              startTime: '09:00',
              endTime: '18:00',
              isAvailable: true
            }]
      }
    }))
  }

  const handleServiceAreaAdd = () => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: [...prev.serviceAreas, {
        areaName: '',
        radiusKm: 10,
        location: null
      }]
    }))
  }

  const handleServiceAreaChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.map((area, i) => 
        i === index ? { ...area, [field]: value } : area
      )
    }))
  }

  const handleServiceAreaRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'service-providers')

      const response = await fetch('/api/upload', {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, result.data.url]
        }))
      } else {
        alert('Image upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // Add current location as a service area
          setFormData(prev => ({
            ...prev,
            serviceAreas: [...prev.serviceAreas, {
              areaName: 'Current Location',
              radiusKm: 10,
              location: {
                type: 'Point',
                coordinates: [longitude, latitude]
              }
            }]
          }))
        },
        (error) => {
          console.error('Location error:', error)
          alert('Could not get your location. Please add service areas manually.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/service-provider/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Service provider profile created successfully! Your profile is pending verification.')
        router.push('/service-provider/dashboard')
      } else {
        const error = await response.json()
        alert('Error setting up service provider profile: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error setting up service provider profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Complete Your Service Provider Profile
            </h1>
            <p className="text-gray-600">
              Help customers find you by providing detailed information about your services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Business Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your business name"
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
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your services and experience"
                />
              </div>
            </div>

            {/* Service Categories */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Service Categories *</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {serviceCategories.map(category => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {category.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Skills & Specializations</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.map(skill => (
                  <span
                    key={skill}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a skill and press Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSkillAdd(e.target.value)
                    e.target.value = ''
                  }
                }}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Type
                  </label>
                  <select
                    value={formData.pricing.type}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, type: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="hourly">Hourly Rate</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricing.hourlyRate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      pricing: { ...prev.pricing, hourlyRate: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter hourly rate"
                  />
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Service Areas</h2>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Use Current Location
                  </button>
                  <button
                    type="button"
                    onClick={handleServiceAreaAdd}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add Area
                  </button>
                </div>
              </div>
              
              {formData.serviceAreas.map((area, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area Name
                      </label>
                      <input
                        type="text"
                        value={area.areaName}
                        onChange={(e) => handleServiceAreaChange(index, 'areaName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Downtown, Sector 21"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Radius (km)
                      </label>
                      <input
                        type="number"
                        value={area.radiusKm}
                        onChange={(e) => handleServiceAreaChange(index, 'radiusKm', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="1"
                        max="50"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => handleServiceAreaRemove(index)}
                        className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="border-2 border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center cursor-pointer hover:border-indigo-500">
                  <div className="text-center">
                    {uploadingImage ? (
                      <div className="text-gray-500">Uploading...</div>
                    ) : (
                      <>
                        <div className="text-gray-400 text-2xl mb-2">+</div>
                        <div className="text-sm text-gray-500">Add Photo</div>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
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

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/home')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={loading || formData.categories.length === 0 || !formData.pricing.hourlyRate}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
