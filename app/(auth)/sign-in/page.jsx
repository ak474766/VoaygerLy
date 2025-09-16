'use client'
import { SignIn } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      // Check user role and redirect accordingly
      checkUserRoleAndRedirect()
    }
  }, [isLoaded, user])

  const checkUserRoleAndRedirect = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        const userRole = data.user?.role

        // Redirect based on role
        switch (userRole) {
          case 'serviceProvider':
            router.push('/service-provider/dashboard')
            break
          case 'admin':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/home')
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      router.push('/home')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-indigo-100">Sign in to your Voyagerly account</p>
        </div>

        {/* Sign In Form */}
        <div className="p-8">
          <SignIn 
            afterSignInUrl="/home"
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-indigo-600 hover:bg-indigo-700 text-white",
                card: "shadow-none",
                headerTitle: "text-2xl font-bold text-gray-800",
                headerSubtitle: "text-gray-600",
                socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
                formFieldInput: "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
                footerActionLink: "text-indigo-600 hover:text-indigo-500"
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/sign-up" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
