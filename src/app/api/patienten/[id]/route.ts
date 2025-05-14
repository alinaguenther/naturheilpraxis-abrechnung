import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const filePath = path.join(process.cwd(), 'src', 'data', 'patienten.json');

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updatedPatient = await request.json();

    const file = await fs.readFile(filePath, 'utf-8');
    let patienten = JSON.parse(file);

    const index = patienten.findIndex((patient: any) => patient.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }

    patienten[index] = { ...patienten[index], ...updatedPatient };
    await fs.writeFile(filePath, JSON.stringify(patienten, null, 2), 'utf-8');

    return NextResponse.json(patienten[index]);
  } catch (error) {
    console.error('PUT Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const file = await fs.readFile(filePath, 'utf-8');
    let patienten = JSON.parse(file);

    const index = patienten.findIndex((patient: any) => patient.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }

    const deletedPatient = patienten.splice(index, 1)[0];
    await fs.writeFile(filePath, JSON.stringify(patienten, null, 2), 'utf-8');

    return NextResponse.json(deletedPatient);
  } catch (error) {
    console.error('DELETE Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}
