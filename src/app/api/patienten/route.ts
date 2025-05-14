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
    const patient = await request.json();
    const file = await fs.readFile(filePath, 'utf-8');
    const patienten = JSON.parse(file);

    // Generate new ID
    const id = Date.now().toString();
    const neuerPatient = { ...patient, id };
    
    patienten.push(neuerPatient);
    await fs.writeFile(filePath, JSON.stringify(patienten, null, 2), 'utf-8');

    return NextResponse.json(neuerPatient);
  } catch (error) {
    console.error('POST Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}