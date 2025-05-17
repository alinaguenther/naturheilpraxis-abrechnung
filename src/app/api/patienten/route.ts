import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/authServer'; // <-- Server-Authentication
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// Hilfsfunktion zum Lesen der Patientendaten
async function readPatientData() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'patienten.json');
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Lesen der Patientendaten:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    // Server-seitige Auth-Prüfung
    const user = await getServerUser();
    if (!user || !user.canAccessPatients) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    
    const patients = await readPatientData();
    return NextResponse.json(patients);
  } catch (error) {
    console.error('GET Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || !user.canEditPatients) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }
    
    const data = await request.json();
    const patients = await readPatientData();
    
    // Einfache ID-Generierung (in einer echten Anwendung würde man UUID verwenden)
    const newPatient = {
      ...data,
      id: `${Date.now()}`
    };
    
    patients.push(newPatient);
    
    // Speichern der aktualisierten Daten
    await fs.writeFile(
      path.join(process.cwd(), 'src', 'data', 'patienten.json'),
      JSON.stringify(patients, null, 2),
      'utf-8'
    );
    
    return NextResponse.json(newPatient);
  } catch (error) {
    console.error('POST Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}