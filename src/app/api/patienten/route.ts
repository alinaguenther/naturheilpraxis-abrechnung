import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'src', 'data', 'patienten.json');

// GET all patients
export async function GET() {
  try {
    const file = await fs.readFile(filePath, 'utf-8');
    const patienten = JSON.parse(file);
    return NextResponse.json(patienten);
  } catch (error) {
    console.error('GET Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

// POST new patient
export async function POST(request: NextRequest) {
  try {
    // Patientendaten aus dem Request extrahieren
    const patientData = await request.json();
    
    // Neue ID generieren
    const id = crypto.randomUUID();
    
    // Sicherstellen, dass alle Felder richtig initialisiert sind
    const newPatient = {
      ...patientData,
      id,
      anschrift: patientData.anschrift || {
        adresse: '',
        hausnummer: '',
        plz: '',
        ort: '',
        adresseZusatz: ''
      },
      kontakt: patientData.kontakt || {
        telefon: '',
        mobil: '',
        email: ''
      },
      termine: patientData.termine || {
        geplant: [],
        vergangen: []
      },
      kartei: patientData.kartei || []
    };
    
    const file = await fs.readFile(filePath, 'utf-8');
    const patienten = JSON.parse(file);

    patienten.push(newPatient);
    await fs.writeFile(filePath, JSON.stringify(patienten, null, 2), 'utf-8');

    return NextResponse.json(newPatient);
  } catch (error) {
    console.error('POST Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}