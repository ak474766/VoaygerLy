'use client'
import { SignUp } from '@clerk/nextjs'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const [selectedRole, setSelectedRole] = useState('user')
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      // Register user in our database after Clerk signup
      registerUserInDatabase()
    }
  }, [isLoaded, user])

  const registerUserInDatabase = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.emailAddresses[0]?.emailAddress,
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          imageUrl: user.imageUrl,
          phone: user.phoneNumbers[0]?.phoneNumber || '',
          role: selectedRole,
        }),
      })

      if (response.ok) {
        // If service provider, redirect to service provider setup
        if (selectedRole === 'serviceProvider') {
          router.push('/service-provider/setup')
        } else {
          router.push('/home')
        }
      }
    } catch (error) {
      console.error('Error registering user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Role Selection */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Join Voyagerly</h2>
          <p className="text-indigo-100 mb-8">Choose how you want to use our platform</p>
          
          <div className="space-y-4">
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === 'user' 
                  ? 'border-white bg-white/10' 
                  : 'border-white/30 hover:border-white/50'
              }`}
              onClick={() => setSelectedRole('user')}
            >
              <div className="flex items-center mb-2">
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  selectedRole === 'user' ? 'bg-white' : 'bg-white/30'
                }`}></div>
                <h3 className="text-xl font-semibold">I'm a Customer</h3>
              </div>
              <p className="text-indigo-100 text-sm ml-7">
                Looking for reliable service providers for home services
              </p>
            </div>

            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === 'serviceProvider' 
                  ? 'border-white bg-white/10' 
                  : 'border-white/30 hover:border-white/50'
              }`}
              onClick={() => setSelectedRole('serviceProvider')}
            >
              <div className="flex items-center mb-2">
                <div className={`w-4 h-4 rounded-full mr-3 ${
                  selectedRole === 'serviceProvider' ? 'bg-white' : 'bg-white/30'
                }`}></div>
                <h3 className="text-xl font-semibold">I'm a Service Provider</h3>
              </div>
              <p className="text-indigo-100 text-sm ml-7">
                Ready to offer my services and grow my business
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <h4 className="font-semibold mb-2">What you get:</h4>
            <ul className="text-sm text-indigo-100 space-y-1">
              <li>• Secure and verified platform</li>
              <li>• Easy booking and payment system</li>
              <li>• 24/7 customer support</li>
              <li>• Rating and review system</li>
            </ul>
          </div>
        </div>

        {/* Right Side - Clerk SignUp */}
        <div className="w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <SignUp 
              afterSignUpUrl="/home"
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-indigo-600 hover:bg-indigo-700 text-white",
                  card: "shadow-none",
                  headerTitle: "text-2xl font-bold text-gray-800",
                  headerSubtitle: "text-gray-600",
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
