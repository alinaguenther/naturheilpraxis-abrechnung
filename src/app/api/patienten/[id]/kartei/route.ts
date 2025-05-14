import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Patient } from '@/types/patient';
import { Karteieintrag } from '@/types/karteieintrag';

export const dynamic = 'force-dynamic';
const filePath = path.join(process.cwd(), 'src', 'data', 'patienten.json');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const file = await fs.readFile(filePath, 'utf-8');
    const patienten: Patient[] = JSON.parse(file);
    const patient = patienten.find((p) => p.id === id);

    if (!patient) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json(patient.kartei ?? []);
  } catch (error) {
    console.error('Fehler beim Abrufen der Kartei:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const neuerEintrag: Karteieintrag = await request.json();
    
    const file = await fs.readFile(filePath, 'utf-8');
    const patienten: Patient[] = JSON.parse(file);
    const patientIndex = patienten.findIndex((p) => p.id === id);

    if (patientIndex === -1) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }

    if (!patienten[patientIndex].kartei) {
      patienten[patientIndex].kartei = [];
    }

    patienten[patientIndex].kartei.unshift(neuerEintrag);
    await fs.writeFile(filePath, JSON.stringify(patienten, null, 2));

    return NextResponse.json(neuerEintrag);
  } catch (error) {
    console.error('Fehler beim Speichern des Karteieintrags:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
