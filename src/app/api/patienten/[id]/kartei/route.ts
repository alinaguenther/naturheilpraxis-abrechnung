import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Patient } from '@/types/patient';
import type { Karteieintrag } from '@/types/karteieintrag';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'src', 'data', 'patienten.json');

// GET: Gibt Kartei-Einträge zurück (sortiert, neuestes oben)
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const file = await fs.readFile(filePath, 'utf-8');
    const patienten: Patient[] = JSON.parse(file);
    const patient = patienten.find((p) => p.id === id);

    if (!patient) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }

    const kartei = Array.isArray(patient.kartei)
      ? [...patient.kartei].sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
      : [];

    return NextResponse.json(kartei);
  } catch (error) {
    console.error('Fehler beim Abrufen der Kartei:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

// POST: Fügt einen neuen Eintrag oben zur Kartei hinzu
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const neuerEintrag: Karteieintrag = await request.json();

    const file = await fs.readFile(filePath, 'utf-8');
    const patienten: Patient[] = JSON.parse(file);
    const patientIndex = patienten.findIndex((p) => p.id === id);

    if (patientIndex === -1) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }

    const patient = patienten[patientIndex];

    if (!Array.isArray(patient.kartei)) {
      patient.kartei = [];
    }

    patient.kartei.unshift(neuerEintrag);

    await fs.writeFile(filePath, JSON.stringify(patienten, null, 2), 'utf-8');

    return NextResponse.json(neuerEintrag);
  } catch (error) {
    console.error('Fehler beim Speichern des Karteieintrags:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
