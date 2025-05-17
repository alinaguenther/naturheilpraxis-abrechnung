import { promises as fs } from 'fs';
import path from 'path';
import { Patient } from '@/types/patient';
import { encrypt, decrypt, isEncrypted } from './encryption';

// Dateipfade für Daten
const patientenFilePath = path.join(process.cwd(), 'src', 'data', 'patienten.json');

/**
 * Liest alle Patienten aus der Datei
 */
async function getAllPatients(): Promise<Patient[]> {
  try {
    const file = await fs.readFile(patientenFilePath, 'utf-8');
    return JSON.parse(file);
  } catch (error) {
    console.error('Fehler beim Lesen der Patienten-Datei:', error);
    return [];
  }
}

/**
 * Findet einen Patienten anhand seiner ID
 */
async function getPatientById(id: string): Promise<Patient | null> {
  const patienten = await getAllPatients();
  return patienten.find(p => p.id === id) || null;
}

/**
 * Speichert alle Patienten in der Datei
 */
async function savePatients(patienten: Patient[]): Promise<void> {
  try {
    await fs.writeFile(patientenFilePath, JSON.stringify(patienten, null, 2), 'utf-8');
  } catch (error) {
    console.error('Fehler beim Speichern der Patienten-Datei:', error);
    throw new Error('Patienten konnten nicht gespeichert werden');
  }
}

/**
 * Erstellt einen neuen Patienten
 */
async function createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
  const patienten = await getAllPatients();
  const id = Date.now().toString();
  
  // Sensible Daten verschlüsseln
  const encryptedPatient = encryptPatientData({
    ...patientData,
    id
  });
  
  patienten.push(encryptedPatient);
  await savePatients(patienten);
  
  // Entschlüsselt zurückgeben
  return decryptPatientData(encryptedPatient);
}

/**
 * Aktualisiert einen Patienten
 */
async function updatePatient(id: string, patientData: Omit<Patient, 'id'>): Promise<Patient | null> {
  const patienten = await getAllPatients();
  const index = patienten.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  // Sensible Daten verschlüsseln
  const encryptedPatient = encryptPatientData({
    ...patientData,
    id
  });
  
  patienten[index] = encryptedPatient;
  await savePatients(patienten);
  
  // Entschlüsselt zurückgeben
  return decryptPatientData(encryptedPatient);
}

/**
 * Löscht einen Patienten
 */
async function deletePatient(id: string): Promise<Patient | null> {
  const patienten = await getAllPatients();
  const index = patienten.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const deletedPatient = patienten.splice(index, 1)[0];
  await savePatients(patienten);
  
  // Entschlüsselt zurückgeben
  return decryptPatientData(deletedPatient);
}

/**
 * Verschlüsselt die sensiblen Daten eines Patienten
 */
function encryptPatientData(patient: Patient): Patient {
  return {
    ...patient,
    vorname: isEncrypted(patient.vorname) ? patient.vorname : encrypt(patient.vorname),
    nachname: isEncrypted(patient.nachname) ? patient.nachname : encrypt(patient.nachname),
    geburtsdatum: isEncrypted(patient.geburtsdatum) ? patient.geburtsdatum : encrypt(patient.geburtsdatum),
    anschrift: {
      ...patient.anschrift,
      adresse: isEncrypted(patient.anschrift.adresse) ? patient.anschrift.adresse : encrypt(patient.anschrift.adresse),
      hausnummer: isEncrypted(patient.anschrift.hausnummer) ? patient.anschrift.hausnummer : encrypt(patient.anschrift.hausnummer),
      plz: isEncrypted(patient.anschrift.plz) ? patient.anschrift.plz : encrypt(patient.anschrift.plz),
      ort: isEncrypted(patient.anschrift.ort) ? patient.anschrift.ort : encrypt(patient.anschrift.ort),
    },
    kontakt: {
      ...patient.kontakt,
      telefon: patient.kontakt.telefon ? (isEncrypted(patient.kontakt.telefon) ? patient.kontakt.telefon : encrypt(patient.kontakt.telefon)) : undefined,
      email: patient.kontakt.email ? (isEncrypted(patient.kontakt.email) ? patient.kontakt.email : encrypt(patient.kontakt.email)) : undefined,
    }
  };
}

/**
 * Entschlüsselt die sensiblen Daten eines Patienten
 */
function decryptPatientData(patient: Patient): Patient {
  return {
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
  };
}

const db = {
  patients: {
    getAll: getAllPatients,
    getById: getPatientById,
    create: createPatient,
    update: updatePatient,
    delete: deletePatient,
  }
};

export default db;