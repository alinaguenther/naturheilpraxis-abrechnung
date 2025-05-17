import db from '@/lib/db';
import { encrypt, decrypt } from '@/lib/encryption';
import { logAccess } from '@/services/auditService';
import { getCurrentUser } from '@/lib/auth';
import { Patient } from '@/types/patient';
import { Karteieintrag } from '@/types/karteieintrag';
import { getInitialForm } from '@/types/patient';

/**
 * Lädt alle Patienten und entschlüsselt sensible Daten
 */
export async function getAllPatients(): Promise<Patient[]> {
  try {
    // Authentifizierungsprüfung
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.canAccessPatients) {
      throw new Error('Keine Berechtigung zum Zugriff auf Patientendaten');
    }

    const response = await fetch('/api/patienten', {
      headers: {
        'Authorization': `Bearer ${currentUser.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Patienten: ${response.status}`);
    }
    
    const encryptedPatients = await response.json();
    
    if (!Array.isArray(encryptedPatients)) {
      throw new Error('Ungültiges Datenformat');
    }
    
    // Log access for audit trail
    logAccess({
      action: 'LIST_PATIENTS',
      user: currentUser.id,
      details: 'Patientenliste abgerufen'
    });
    
    // Decrypt sensitive data for each patient
    const decryptedPatients = encryptedPatients.map(patient => ({
      ...patient,
      vorname: decrypt(patient.vorname),
      nachname: decrypt(patient.nachname),
      geburtsdatum: decrypt(patient.geburtsdatum),
      anschrift: {
        ...patient.anschrift,
        adresse: decrypt(patient.anschrift.adresse),
        hausnummer: decrypt(patient.anschrift.hausnummer),
        plz: decrypt(patient.anschrift.plz),
        ort: decrypt(patient.anschrift.ort),
      },
      kontakt: {
        ...patient.kontakt,
        telefon: patient.kontakt.telefon ? decrypt(patient.kontakt.telefon) : undefined,
        email: patient.kontakt.email ? decrypt(patient.kontakt.email) : undefined,
      }
    }));
    
    return decryptedPatients;
  } catch (error) {
    console.error('Fehler beim Laden der Patienten:', error);
    throw new Error('Patienten konnten nicht geladen werden');
  }
}

/**
 * Lädt einen einzelnen Patienten anhand seiner ID
 * @param id - ID des Patienten
 * @returns Patientenobjekt oder null, wenn nicht gefunden
 */
export async function getPatient(id: string): Promise<Patient | null> {
  try {
    const response = await fetch(`/api/patienten/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Fehler beim Laden des Patienten: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fehler beim Laden des Patienten ${id}:`, error);
    throw new Error('Patient konnte nicht geladen werden');
  }
}

/**
 * Erstellt einen neuen Patienten
 * @param patientData - Patienten-Daten ohne ID
 * @returns Erstelltes Patientenobjekt mit ID
 */
export async function createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
  try {
    const response = await fetch('/api/patienten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      throw new Error(`Fehler beim Erstellen des Patienten: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fehler beim Erstellen des Patienten:', error);
    throw new Error('Patient konnte nicht erstellt werden');
  }
}

/**
 * Aktualisiert einen vorhandenen Patienten
 * @param id - ID des zu aktualisierenden Patienten
 * @param patientData - Aktualisierte Patientendaten
 * @returns Aktualisiertes Patientenobjekt
 */
export async function updatePatient(id: string, patientData: Omit<Patient, 'id'>): Promise<Patient> {
  try {
    const response = await fetch(`/api/patienten/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      throw new Error(`Fehler beim Aktualisieren des Patienten: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Patienten ${id}:`, error);
    throw new Error('Patient konnte nicht aktualisiert werden');
  }
}

/**
 * Löscht einen Patienten
 * @param id - ID des zu löschenden Patienten
 * @returns Gelöschtes Patientenobjekt
 */
export async function deletePatient(id: string): Promise<Patient> {
  try {
    const response = await fetch(`/api/patienten/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Fehler beim Löschen des Patienten: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fehler beim Löschen des Patienten ${id}:`, error);
    throw new Error('Patient konnte nicht gelöscht werden');
  }
}

/**
 * Holt die Karteieinträge eines Patienten
 * @param patientId - ID des Patienten
 * @returns Array von Karteieinträgen
 */
export async function getPatientRecords(patientId: string): Promise<Karteieintrag[]> {
  try {
    const response = await fetch(`/api/patienten/${patientId}/kartei`);
    
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Karteieinträge: ${response.status}`);
    }
    
    const records = await response.json();
    
    if (!Array.isArray(records)) {
      throw new Error('Ungültiges Datenformat: Erwarte ein Array von Karteieinträgen');
    }
    
    return records;
  } catch (error) {
    console.error(`Fehler beim Laden der Karteieinträge für Patient ${patientId}:`, error);
    throw new Error('Karteieinträge konnten nicht geladen werden');
  }
}

/**
 * Erstellt einen neuen Karteieintrag für einen Patienten
 * @param patientId - ID des Patienten
 * @param eintrag - Karteieintrag ohne ID
 * @returns Erstellter Karteieintrag mit ID
 */
export async function createPatientRecord(patientId: string, eintrag: Omit<Karteieintrag, 'id'>): Promise<Karteieintrag> {
  try {
    const response = await fetch(`/api/patienten/${patientId}/kartei`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eintrag),
    });
    
    if (!response.ok) {
      throw new Error(`Fehler beim Erstellen des Karteieintrags: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fehler beim Erstellen eines Karteieintrags für Patient ${patientId}:`, error);
    throw new Error('Karteieintrag konnte nicht erstellt werden');
  }
}

/**
 * Liefert ein leeres Patientenformular zurück
 */
export function getEmptyPatientForm(): Omit<Patient, 'id'> {
  return getInitialForm();
}