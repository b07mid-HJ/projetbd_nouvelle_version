import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define paths that don't require authentication
const publicPaths = [
  '/login',
]

// Define role-based access control
const roleBasedRoutes: Record<string, string[]> = {
  // Example: Admin role can access all routes
  // Replace with actual role IDs from your system
  'admin': ['*'], // Wildcard for all routes
  'responsable': ['/'],
  'simple': ['/formateurs', '/participants', '/formations'] // Simple users can only access dashboard
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if user is authenticated
  const userId = request.cookies.get('userId')?.value
  
  // If user is on login page and already authenticated, redirect to dashboard
  if (pathname === '/login' && userId) {
    // Redirect simple users to formateurs page, others to dashboard
    const userRole = request.cookies.get('userRole')?.value
    if (userRole === 'simple') {
      return NextResponse.redirect(new URL('/formateurs', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Allow access to public paths without authentication
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Check for authentication cookies
  const userRole = request.cookies.get('userRole')?.value
  
  // If not authenticated, redirect to login
  if (!userId) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // If authenticated but no role, allow only dashboard access
  if (!userRole && pathname !== '/') {
    const dashboardUrl = new URL('/', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  // For simple users, redirect to formateurs page if they're at the root
  if (userRole === 'simple' && pathname === '/') {
    return NextResponse.redirect(new URL('/formateurs', request.url))
  }
  
  // Check role-based access
  if (userRole && pathname !== '/') {
    const allowedRoutes = roleBasedRoutes[userRole] || []
    
    // Check if user has access to this route
    const hasAccess = allowedRoutes.some(route => {
      if(userRole === 'responsable') return pathname === '/' // Only allow access to root path
      if (route === '*') return true // Wildcard access
      return pathname.startsWith(route)
    })
    
    // If no access, redirect to dashboard or formateurs for simple users
    if (!hasAccess) {
      if (userRole === 'simple') {
        return NextResponse.redirect(new URL('/formateurs', request.url))
      }
      const dashboardUrl = new URL('/', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.png$).*)',
  ],
}