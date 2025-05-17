import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

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

/**
 * Prüft den aktuellen Benutzer anhand des Session-Cookies
 * Nur in Server Components oder API-Routen verwenden!
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    
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
 * Verifiziert einen JWT-Token und gibt den Benutzer zurück
 */
export async function verifyAuthToken(token: string): Promise<User | null> {
  try {
    // Hier würdest du eine richtige JWT-Validierung durchführen
    // Für Entwicklungszwecke geben wir direkt einen gültigen Benutzer zurück
    return AUTHORIZED_USERS['praxis'];
  } catch (error) {
    console.error('Token-Überprüfungsfehler:', error);
    return null;
  }
}