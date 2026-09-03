import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Canonical public host — only redirect TO this, never away from it. */
const CANONICAL_HOST = 'www.explore360.co.in';
const APEX_HOST = 'explore360.co.in';

function canonicalizeHost(request: NextRequest): NextResponse | null {
  const hostHeader = request.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0].toLowerCase();

  // Only act on production apex. Skip localhost, Vercel previews, and www itself.
  if (hostname !== APEX_HOST) return null;

  const url = request.nextUrl.clone();
  url.hostname = CANONICAL_HOST;
  url.protocol = 'https:';
  url.port = '';

  return NextResponse.redirect(url, 308);
}

export function middleware(request: NextRequest) {
  const canonical = canonicalizeHost(request);
  if (canonical) return canonical;

  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login';
  const token = request.cookies.get('admin_session')?.value || '';

  if (path.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    // Apex → www on all page routes (skip Next internals & common static files)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
};
