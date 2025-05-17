export interface User {
  id: string;
  name: string;
  role: 'admin' | 'praxis';
  canAccessPatients: boolean;
  canEditPatients: boolean;
  canAccessBilling: boolean;
  token: string;
}

// Für die Client-Seite verwenden wir ein Mock-Objekt und Session Storage
// In einer echten Anwendung würde man NextAuth.js oder ähnliches nutzen
const MOCK_USER: User = {
  id: 'praxis',
  name: 'Praxis-Account',
  role: 'praxis',
  canAccessPatients: true,
  canEditPatients: true,
  canAccessBilling: true,
  token: 'mock-token-for-development'
};

/**
 * Holt den aktuellen Benutzer vom Client
 * In einer echten Anwendung würde dieser Wert aus einer Session kommen
 */
export async function getCurrentUser(): Promise<User | null> {
  // Für Entwicklungszwecke geben wir immer einen Mock-Benutzer zurück
  return MOCK_USER;
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