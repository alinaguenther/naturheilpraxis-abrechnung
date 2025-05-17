// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/auth';

// Pfade, die ohne Authentifizierung zugänglich sind
const publicPaths = ['/login', '/api/auth', '/images'];

export async function middleware(request: NextRequest) {
  // Prüfe, ob der Pfad öffentlich ist
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Authentifizierung prüfen
  const session = await verifySessionToken();
  
  // Wenn nicht authentifiziert, zur Login-Seite umleiten
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Wenn authentifiziert, Anfrage weitergeben
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};