import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser, isAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    // Authentifizierung prüfen
    if (!currentUser || !isAuthorized(currentUser, 'view_patients')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = context.params;
    const patient = await db.patients.getById(id);
    
    if (!patient) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }
    
    return NextResponse.json(patient);
  } catch (error) {
    console.error('GET Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    // Authentifizierung prüfen
    if (!currentUser || !isAuthorized(currentUser, 'edit_patients')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = context.params;
    const updatedData = await request.json();
    
    const updatedPatient = await db.patients.update(id, updatedData);
    
    if (!updatedPatient) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('PUT Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    // Authentifizierung prüfen
    if (!currentUser || !isAuthorized(currentUser, 'edit_patients')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = context.params;
    const deletedPatient = await db.patients.delete(id);
    
    if (!deletedPatient) {
      return NextResponse.json({ error: 'Patient nicht gefunden' }, { status: 404 });
    }
    
    return NextResponse.json(deletedPatient);
  } catch (error) {
    console.error('DELETE Fehler:', error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}