import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../lib/jwt';

export function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const decoded = JWTUtils.verifyToken(token);
  if (!decoded) {
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}

export function requireAuth(handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async (req: NextRequest) => {
    const authResult = authMiddleware(req);
    
    if (authResult.status === 307 || authResult.status === 308) {
      return authResult; // Redirect response
    }

    return handler(req);
  };
}
