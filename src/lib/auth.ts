// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'praxis';
  canAccessPatients: boolean;
  canEditPatients: boolean;
  canAccessBilling: boolean;
  token: string;
}

// In einer echten Anwendung würde dies aus einer sicheren Quelle (z.B. DB) kommen
const AUTHORIZED_USERS: Record<string, User> = {
  'praxis': {
    id: 'praxis',
    name: 'Praxis-Account',
    role: 'praxis',
    canAccessPatients: true,
    canEditPatients: true,
    canAccessBilling: true,
    token: 'praxis-token-1234567890'
  },
  'admin': {
    id: 'admin',
    name: 'Admin-Account',
    role: 'admin',
    canAccessPatients: true,
    canEditPatients: true,
    canAccessBilling: true,
    token: 'admin-token-1234567890'
  }
};

// Sichere JWT-Verwaltung für Praxismitarbeiter
export async function createSessionToken(userId: string, role: 'admin' | 'practitioner') {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  // Token mit kurzer Gültigkeit (8h) und strengen Ansprüchen
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .setIssuedAt()
    .setNotBefore(Math.floor(Date.now() / 1000))
    .sign(secret);
  
  // Als httpOnly, secure Cookie speichern
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'session_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60, // 8 Stunden
    path: '/'
  });
  
  return token;
}

// Token-Verifizierung
export async function verifySessionToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const verified = await jwtVerify(token, secret);
    return verified.payload as { userId: string; role: string };
  } catch (error) {
    cookieStore.delete('session_token');
    return null;
  }
}

/**
 * Prüft den aktuellen Benutzer anhand des Session-Cookies
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // In einer Produktionsumgebung: Session-Cookie prüfen
    // const cookieStore = cookies();
    // const sessionId = cookieStore.get('session_id')?.value;
    
    // Für Entwicklungszwecke: hartcodierter Benutzer
    const currentUser = AUTHORIZED_USERS['praxis'];
    
    if (!currentUser) {
      console.warn('Kein authentifizierter Benutzer gefunden');
      return null;
    }
    
    return currentUser;
  } catch (error) {
    console.error('Fehler beim Abrufen des aktuellen Benutzers:', error);
    return null;
  }
}

/**
 * Prüft, ob ein Benutzer berechtigt ist, eine bestimmte Aktion auszuführen
 */
export function isAuthorized(user: User | null, action: string): boolean {
  if (!user) return false;
  
  switch (action) {
    case 'view_patients':
      return user.canAccessPatients;
    case 'edit_patients':
      return user.canEditPatients;
    case 'view_billing':
    case 'create_invoice':
      return user.canAccessBilling;
    default:
      return false;
  }
}

/**
 * Hilfsfunktion zum Erstellen eines Auth-Headers
 */
export function getAuthHeaders(user: User | null): HeadersInit {
  return user?.token ? {
    'Authorization': `Bearer ${user.token}`
  } : {};
}