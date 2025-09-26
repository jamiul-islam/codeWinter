import { NextResponse, type NextRequest } from 'next/server'
import { getServerSupabaseClient } from './lib/supabase/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await getServerSupabaseClient()

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings']
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname.match(/^\/project\/[^/]+/)
  )

  // If accessing a protected route without authentication, redirect to home
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and accessing home or signin page, redirect to dashboard
  if (session && (pathname === '/' || pathname === '/signin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
