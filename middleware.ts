import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Serve the reference landing HTML at the site root, outside the app shell.
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/landing-template'
    return NextResponse.rewrite(url)
  }

  // Landing is public. Sign-in, sign-up, and password reset stay open so a
  // session can be created. Every other page requires authentication.
  const publicRoutes = [
    '/landing-template',
    '/signin',
    '/authentication/sign-up',
    '/authentication/reset-password',
  ]

  const isPublicRoute =
    pathname === '/' ||
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    )

  // Old learning-paths URLs → Tracks (still gated; anonymous users then hit sign-in)
  if (
    pathname === '/learning-paths' ||
    pathname.startsWith('/learning-paths/')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/tracks'
    return NextResponse.redirect(url)
  }

  // Skip middleware for the public pages, static files, and Next.js internals
  if (
    isPublicRoute ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Check if user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // If no user found, block the request
    if (error || !user) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/signin', request.url)
      loginUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // If user is authenticated, allow access
    return response
    
  } catch (error) {
    console.error('❌ Middleware authentication error:', error)
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/signin', request.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
