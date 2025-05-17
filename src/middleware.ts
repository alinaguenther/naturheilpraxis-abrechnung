// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Schützt API-Routen ohne Cookies zu verwenden
export function middleware(request: NextRequest) {
  // Für Entwicklungszwecke: keine Authentifizierung erzwingen
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }
  
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth');
  
  // API-Schutz
  if (isApiRoute && !isAuthRoute) {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // In einer vollständigen Implementierung würde der Token hier validiert werden
  }
  
  return NextResponse.next();
}

// Konfiguration: Auf welche Routen die Middleware angewendet werden soll
export const config = {
  matcher: [
    '/api/((?!auth).*)'
  ],
};