import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/auth/login', '/auth/register'];
const protectedPaths = ['/dashboard'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname } = req.nextUrl;

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  const isProtected = protectedPaths.some((path) => pathname.startsWith(pathname));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/dashboard/schedule/card', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
};
