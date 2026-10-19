import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/documents'];

  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    // Redirect to login page if trying to access protected route without token
    const loginUrl = new URL('/auth', request.url);
    // TODO: Add redirect param to return after login
    // loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: Redirect authenticated users away from auth page
  if (pathname === '/auth' && token) {
    return NextResponse.redirect(new URL('/documents', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
