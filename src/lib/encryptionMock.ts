/**
 * Verschlüsselt einen String (Mock-Funktion für Entwicklung)
 */
export function encrypt(text: string): string {
  if (!text) return '';
  return text; // Für Entwicklung: Keine tatsächliche Verschlüsselung
}

/**
 * Entschlüsselt einen String (Mock-Funktion für Entwicklung)
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  return encryptedText; // Für Entwicklung: Keine tatsächliche Entschlüsselung
}

/**
 * Prüft, ob ein Text verschlüsselt ist
 */
export function isEncrypted(text: string): boolean {
  return text.startsWith('enc:');
}