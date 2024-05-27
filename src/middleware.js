import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const isProtected = ['/', '/profile', '/dashboard', '/logout'];
const authRoutes = ['/auth/login', '/auth/register'];
const apiProtectedRoutes = ['/api/posts', '/api/profile'];

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookieToken = cookies().get('session')?.value;
  const headerToken = req.headers.get('authorization')?.split(' ')[1];

  const isApiRoute = apiProtectedRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = isProtected.some(route => pathname === route);
  const isAuthRoute = authRoutes.some(route => pathname === route);

  const verifyToken = async (token) => {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      return payload;
    } catch (error) {
      console.log("=====>>> Error verifying token: ", error);
      return null;
    }
  };

  if (isApiRoute) {
    if (!headerToken) {
      console.log("=====>>> headerToken missing");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(headerToken);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (isProtectedRoute) {
    if (!cookieToken) {
      return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
    }

    const payload = await verifyToken(cookieToken);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
  }

  if (isAuthRoute) {
    if (cookieToken) {
      const payload = await verifyToken(cookieToken);
      if (payload) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }
      return NextResponse.json({ error: 'Unauthorized, invalid Token' }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    ...isProtected.map(route => route + '(.*)'),
    ...authRoutes.map(route => route + '(.*)'),
    ...apiProtectedRoutes.map(route => route + '(.*)'),
  ],
};
