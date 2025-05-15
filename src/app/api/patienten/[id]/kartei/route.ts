import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { KarteieintragSchema } from '@/schema/karteieintragSchema';
import { Patient } from '@/types/patient';

export const dynamic = 'force-dynamic';
const filePath = path.join(process.cwd(), 'src', 'data', 'patienten.json');

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const file = await fs.readFile(filePath, 'utf-8');
    const patienten: Patient[] = JSON.parse(file);
    const patient = patienten.find(p => p.id === params.id);

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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();

    const validation = KarteieintragSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Ungültiger Eintrag', details: validation.error.format() }, { status: 400 });
    }

    const neuerEintrag = validation.data;

    const file = await fs.readFile(filePath, 'utf-8');
    const patienten: Patient[] = JSON.parse(file);
    const patientIndex = patienten.findIndex(p => p.id === params.id);

    if (patientIndex === -1) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }

    if (!Array.isArray(patienten[patientIndex].kartei)) {
      patienten[patientIndex].kartei = [];
    }

    patienten[patientIndex].kartei.unshift(neuerEintrag);
    await fs.writeFile(filePath, JSON.stringify(patienten, null, 2), 'utf-8');

    return NextResponse.json(neuerEintrag);
  } catch (error) {
    console.error('Fehler beim Speichern des Kartei-Eintrags:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}