/**
 * Verschlüsselt einen String mit AES-GCM
 * In einer Produktionsumgebung sollte eine richtige Krypto-Bibliothek verwendet werden.
 */
export function encrypt(text: string): string {
  // Simuliert Verschlüsselung für Entwicklungszwecke
  if (!text) return '';
  
  // In einer echten Anwendung würdest du hier eine richtige Verschlüsselung implementieren
  // z.B. mit crypto-js oder der Web Crypto API
  
  // Diese einfache Implementierung ist nur für Entwicklungszwecke
  return `enc:${Buffer.from(text).toString('base64')}`;
}

/**
 * Entschlüsselt einen String, der mit encrypt() verschlüsselt wurde
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  
  // Einfache Implementierung für Entwicklungszwecke
  if (encryptedText.startsWith('enc:')) {
    try {
      return Buffer.from(encryptedText.substring(4), 'base64').toString();
    } catch (e) {
      console.error('Entschlüsselungsfehler:', e);
      return encryptedText; // Fallback
    }
  }
  
  // Wenn der Text nicht verschlüsselt ist, gib ihn unverändert zurück
  return encryptedText;
}

/**
 * Prüft, ob ein Text verschlüsselt ist
 */
export function isEncrypted(text: string): boolean {
  return text.startsWith('enc:');
}