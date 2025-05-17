// src/services/auditService.ts
import db from '@/lib/db';
import { getServerSession } from "next-auth";

interface AuditLogEntry {
  action: string;  // Welche Aktion wurde durchgeführt
  user: string;    // Welcher Benutzer hat die Aktion durchgeführt
  timestamp: Date; // Wann wurde die Aktion durchgeführt
  details?: string; // Zusätzliche Details
  ipAddress?: string; // IP-Adresse (optional)
}

const auditLog: AuditLogEntry[] = [];

/**
 * Protokolliert einen Zugriff im Audit-Log
 */
export function logAccess(entry: Omit<AuditLogEntry, 'timestamp'>): void {
  const logEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date()
  };
  
  auditLog.push(logEntry);
  
  // In einer Produktionsumgebung würdest du das Log in einer Datenbank speichern
  console.log(`[AUDIT] ${logEntry.timestamp.toISOString()} | ${logEntry.user} | ${logEntry.action} | ${logEntry.details || ''}`);
  
  // Hier könntest du auch einen API-Aufruf implementieren, um das Log zu speichern
}

/**
 * Ruft das Audit-Log ab
 * In einer echten Anwendung würde dies wahrscheinlich gefiltert und paginiert sein
 */
export function getAuditLog(): AuditLogEntry[] {
  return [...auditLog]; // Kopie zurückgeben, um Modifikationen zu verhindern
}

// Für DSGVO-Berichte
export async function getPatientAccessLog(patientId: string) {
  return db.auditLog.findMany({
    where: {
      targetType: 'patient',
      targetId: patientId
    },
    include: {
      user: {
        select: {
          name: true,
          role: true
        }
      }
    },
    orderBy: {
      timestamp: 'desc'
    }
  });
}