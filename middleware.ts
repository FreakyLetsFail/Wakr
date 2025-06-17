import { updateSession } from '@/lib/supabase-middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const isAuth = !!user;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isPublicPage = request.nextUrl.pathname === '/' || 
                       request.nextUrl.pathname.startsWith('/api/webhooks') ||
                       request.nextUrl.pathname.startsWith('/api/auth') ||
                       request.nextUrl.pathname.startsWith('/api/cities') ||
                       request.nextUrl.pathname.startsWith('/api/subscription') ||
                       request.nextUrl.pathname.startsWith('/privacy') ||
                       request.nextUrl.pathname.startsWith('/terms') ||
                       request.nextUrl.pathname.startsWith('/pricing') ||
                       request.nextUrl.pathname.startsWith('/subscription');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
  
  // Debug logging
  console.log('🔍 Middleware check:', {
    path: request.nextUrl.pathname,
    isAuth,
    isAuthPage,
    isPublicPage,
    userEmail: user?.email
  });
  
  // Redirect to login if not authenticated and trying to access protected routes
  if (!isAuth && !isAuthPage && !isPublicPage) {
    console.log('🚫 Redirecting to login from:', request.nextUrl.pathname);
    const newUrl = new URL('/login', request.url);
    newUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(newUrl);
  }
  
  // Redirect to dashboard if authenticated and trying to access auth pages
  if (isAuth && isAuthPage) {
    console.log('✅ Authenticated user accessing auth page, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Check admin access - for now, just check if user exists
  // TODO: Add proper role checking once user metadata is set up in Supabase
  if (isAdminPage && !isAuth) {
    console.log('🚫 Non-authenticated user trying to access admin page');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  console.log('✅ Allowing access to:', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    // Skip auth API routes and Next.js internals
    '/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Do NOT run for auth API routes
  ],
};