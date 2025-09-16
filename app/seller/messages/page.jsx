'use client'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function SellerMessages() {
  const { user } = useUser()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      // Mock data for conversations
      const mockConversations = [
        {
          _id: '1',
          customerId: 'user1',
          customerName: 'John Doe',
          customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          bookingId: 'BK1234567890',
          serviceType: 'Home Cleaning',
          lastMessage: 'What time will you arrive tomorrow?',
          lastMessageTime: '2024-01-20T15:30:00Z',
          unreadCount: 2,
          status: 'active'
        },
        {
          _id: '2',
          customerId: 'user2',
          customerName: 'Jane Smith',
          customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          bookingId: 'BK1234567891',
          serviceType: 'Plumbing Repair',
          lastMessage: 'Thank you for the excellent service!',
          lastMessageTime: '2024-01-19T10:15:00Z',
          unreadCount: 0,
          status: 'completed'
        }
      ]
      setConversations(mockConversations)
      
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0])
        fetchMessages(mockConversations[0]._id)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      // Mock messages data
      const mockMessages = [
        {
          _id: '1',
          senderId: 'user1',
          senderType: 'customer',
          content: { text: 'Hi, I have booked your cleaning service for tomorrow.' },
          createdAt: '2024-01-20T10:00:00Z',
          status: 'read'
        },
        {
          _id: '2',
          senderId: user?.id,
          senderType: 'provider',
          content: { text: 'Thank you for booking! I will be there at the scheduled time.' },
          createdAt: '2024-01-20T10:05:00Z',
          status: 'read'
        },
        {
          _id: '3',
          senderId: 'user1',
          senderType: 'customer',
          content: { text: 'What time will you arrive tomorrow?' },
          createdAt: '2024-01-20T15:30:00Z',
          status: 'delivered'
        },
        {
          _id: '4',
          senderId: 'user1',
          senderType: 'customer',
          content: { text: 'Also, do you bring your own cleaning supplies?' },
          createdAt: '2024-01-20T15:31:00Z',
          status: 'delivered'
        }
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const message = {
        _id: Date.now().toString(),
        senderId: user?.id,
        senderType: 'provider',
        content: { text: newMessage },
        createdAt: new Date().toISOString(),
        status: 'sent'
      }

      setMessages(prev => [...prev, message])
      setNewMessage('')

      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv._id === selectedConversation._id 
            ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
            : conv
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } else {
      return date.toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-500">Chat with your customers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Conversations</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-4">💬</div>
                    <h4 className="font-medium text-gray-900 mb-2">No conversations yet</h4>
                    <p className="text-sm text-gray-500">Start getting bookings to chat with customers</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map(conversation => (
                      <button
                        key={conversation._id}
                        onClick={() => {
                          setSelectedConversation(conversation)
                          fetchMessages(conversation._id)
                        }}
                        className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
                          selectedConversation?._id === conversation._id ? 'bg-indigo-50 border-indigo-200' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            className="w-10 h-10 rounded-full"
                            src={conversation.customerImage}
                            alt={conversation.customerName}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.customerName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessageTime)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{conversation.serviceType}</p>
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={selectedConversation.customerImage}
                        alt={selectedConversation.customerName}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedConversation.customerName}</h4>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.serviceType} • #{selectedConversation.bookingId}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(message => (
                      <div
                        key={message._id}
                        className={`flex ${message.senderType === 'provider' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderType === 'provider'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderType === 'provider' ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">💬</div>
                    <h4 className="font-medium text-gray-900 mb-2">Select a conversation</h4>
                    <p className="text-sm text-gray-500">Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
