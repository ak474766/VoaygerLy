import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
  '/service-provider(.*)',
  '/admin(.*)',
  '/home(.*)',
])

const isServiceProviderRoute = createRouteMatcher([
  '/service-provider(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

const isCustomerOnlyRoute = createRouteMatcher([
  '/home/cart(.*)',
  '/home/my-orders(.*)',
  '/home/order-placed(.*)',
  '/home/add-address(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
    
    const { userId, sessionClaims } = await auth()

    // Try to read role from Clerk public metadata first
    let role = (sessionClaims?.publicMetadata as any)?.role as string | undefined

    // If role not in Clerk, fetch from our DB via API
    if (!role && userId) {
      try {
        const url = new URL('/api/auth/register', req.url)
        const resp = await fetch(url, { headers: { 'x-middleware-fetch': '1' } })
        if (resp.ok) {
          const data = await resp.json()
          role = data?.user?.role
        }
      } catch {}
    }

    // Gate service provider routes
    if (isServiceProviderRoute(req)) {
      if (role !== 'serviceProvider') {
        const url = new URL('/home', req.url)
        url.searchParams.set('error', 'forbidden')
        return NextResponse.redirect(url)
      }
    }

    // Prevent service providers from accessing certain customer-only routes
    if (isCustomerOnlyRoute(req)) {
      if (role === 'serviceProvider') {
        const url = new URL('/service-provider/dashboard', req.url)
        return NextResponse.redirect(url)
      }
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}