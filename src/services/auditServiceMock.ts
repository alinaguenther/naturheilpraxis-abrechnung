import db from '@/lib/db';
import { getServerSession } from "next-auth";

interface AuditLogEntry {
  action: string;
  user: string;
  details?: string;
  targetType?: string;
  targetId?: string;
  timestamp?: Date;
}

const auditLog: AuditLogEntry[] = [];

/**
 * Protokolliert einen Zugriff (Mock-Funktion für Entwicklung)
 */
export function logAccess(entry: AuditLogEntry): void {
  // Für Entwicklung nur in die Konsole loggen
  console.log(`[AUDIT] ${new Date().toISOString()} | ${entry.user} | ${entry.action} | ${entry.details || ''}`);
}

/**
 * Ruft das Audit-Log ab
 * In einer echten Anwendung würde dies wahrscheinlich gefiltert und paginiert sein
 */
export function getAuditLog(): AuditLogEntry[] {
  return auditLog;
}

// Für DSGVO-Berichte
export async function getPatientAccessLog(patientId: string) {
  // Mock implementation: filter the in-memory auditLog array
  return auditLog
    .filter(entry => entry.targetType === 'patient' && entry.targetId === patientId)
    .sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0))
    .map(entry => ({
      ...entry,
      user: {
        name: entry.user,
        role: 'mock' // Replace with actual role if available
      }
    }));
}