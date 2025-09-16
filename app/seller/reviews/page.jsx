'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function SellerReviews() {
  const { user } = useUser()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      // Mock data for reviews
      const mockReviews = [
        {
          _id: '1',
          userId: 'user1',
          customerName: 'John Doe',
          customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          rating: 5,
          title: 'Excellent Service',
          comment: 'Very professional and thorough cleaning. Highly recommended!',
          serviceType: 'Home Cleaning',
          createdAt: '2024-01-15T10:00:00Z',
          response: null
        },
        {
          _id: '2',
          userId: 'user2',
          customerName: 'Jane Smith',
          customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          rating: 4,
          title: 'Good Work',
          comment: 'Fixed the plumbing issue quickly. Could have been a bit more careful with the mess.',
          serviceType: 'Plumbing Repair',
          createdAt: '2024-01-10T14:30:00Z',
          response: {
            comment: 'Thank you for the feedback! We\'ll be more careful next time.',
            respondedAt: '2024-01-11T09:00:00Z'
          }
        }
      ]
      setReviews(mockReviews)
      
      // Calculate stats
      const total = mockReviews.length
      const avgRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / total
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      mockReviews.forEach(review => {
        distribution[review.rating]++
      })
      
      setStats({
        averageRating: avgRating,
        totalReviews: total,
        ratingDistribution: distribution
      })
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (reviewId, responseText) => {
    try {
      // API call to respond to review
      console.log('Responding to review:', reviewId, responseText)
      fetchReviews() // Refresh after response
    } catch (error) {
      console.error('Error responding to review:', error)
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
              <p className="text-sm text-gray-500">View and respond to customer feedback</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-xs text-gray-400">{stats.totalReviews} reviews</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ 
                        width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{stats.ratingDistribution[rating]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Reviews</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalReviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalReviews > 0 ? Math.round((reviews.filter(r => r.response).length / stats.totalReviews) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">5-Star Reviews</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalReviews > 0 ? Math.round((stats.ratingDistribution[5] / stats.totalReviews) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Complete some services to start receiving customer reviews.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={review.customerImage}
                      alt={review.customerName}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{review.customerName}</h4>
                          <p className="text-sm text-gray-500">{review.serviceType}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      
                      {review.title && (
                        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                      )}
                      
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      
                      {review.response ? (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-900">Your Response</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDate(review.response.respondedAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{review.response.comment}</p>
                        </div>
                      ) : (
                        <div className="border-t border-gray-200 pt-4">
                          <ReviewResponseForm 
                            reviewId={review._id}
                            onSubmit={handleResponse}
                          />
                        </div>
                      )}
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

function ReviewResponseForm({ reviewId, onSubmit }) {
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!response.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(reviewId, response)
      setResponse('')
    } catch (error) {
      console.error('Error submitting response:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Write a response to this review..."
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setResponse('')}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!response.trim() || isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? 'Sending...' : 'Send Response'}
        </button>
      </div>
    </form>
  )
}
