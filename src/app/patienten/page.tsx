'use client';

import { usePatients } from '@/hooks/usePatients';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/patients/SearchBar';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientTable } from '@/components/patients/PatientTable';
import { ConfirmDialog } from '@/components/layout/ConfirmDialog';
import { useEffect, useRef, useCallback } from 'react';
import type { Patient } from '@/types/patient';

export default function PatientenSeite() {
  const {
    patienten,
    suchbegriff,
    setSuchbegriff,
    sortKey,
    sortOrder,
    formularOffenId,
    setFormularOffenId,
    form,
    setForm,
    deleteId,
    setDeleteId,
    handleSort,
    handleDelete,
    handleSubmit,
  } = usePatients();

  // Refs für Fokus-Management
  const modalRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  // Fokus-Management für Modal
  useEffect(() => {
    if (formularOffenId) {
      // Speichert das Element, das den Fokus hatte, bevor das Modal geöffnet wurde
      returnFocusRef.current = document.activeElement as HTMLElement;
      
      // Fokus auf das Modal setzen
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Verhindert Scrollen im Hintergrund
      document.body.style.overflow = 'hidden';
    } else {
      // Stellt den Fokus wieder her, wenn das Modal geschlossen wird
      if (returnFocusRef.current) {
        returnFocusRef.current.focus();
      }
      
      // Scrollen wieder erlauben
      document.body.style.overflow = 'auto';
    }
  }, [formularOffenId]);

  // Keyboard-Handler für Modal-Escape
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setFormularOffenId(null);
    }
  };

  const handleEdit = useCallback((patient: Patient) => {
    setForm({
      vorname: patient.vorname,
      nachname: patient.nachname,
      geburtsdatum: patient.geburtsdatum,
      geschlecht: patient.geschlecht || '',
      anschrift: {
        adresse: patient.anschrift?.adresse || '',
        hausnummer: patient.anschrift?.hausnummer || '',
        plz: patient.anschrift?.plz || '',
        ort: patient.anschrift?.ort || '',
        adresseZusatz: patient.anschrift?.adresseZusatz
      },
      kontakt: {
        telefon: patient.kontakt?.telefon || '',
        mobil: patient.kontakt?.mobil || '',
        email: patient.kontakt?.email || ''
      },
      versicherung: patient.versicherung || '',
      termine: patient.termine || {
        geplant: [],
        vergangen: []
      },
      kartei: patient.kartei || []
    });
  }, [setForm]);

  return (
    <main className="page-container">
      <Header />

      <section className="section-container" aria-labelledby="page-heading">
        <div className="content-wrapper space-y-6">
          <div className="text-center">
            <h1 id="page-heading" className="page-title">Patienten-Verwaltung</h1>
            <p className="card-text">Verwalten Sie hier Ihre Patientendaten</p>
          </div>

          <SearchBar
            value={suchbegriff}
            onChange={setSuchbegriff}
            onNewPatient={() => setFormularOffenId('neu')}
          />

          <div className="card" role="region" aria-label="Patiententabelle">
            <PatientTable 
              patients={patienten}
              sortKey={sortKey}
              sortOrder={sortOrder}
              onSort={handleSort}
              onEdit={(patient) => {
                setFormularOffenId(patient.id);
                handleEdit(patient);
              }}
              onDelete={setDeleteId}
              formatDate={formatDate}
            />
          </div>
        </div>
      </section>

      {(formularOffenId === 'neu' || typeof formularOffenId === 'string') && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="form-title"
          onKeyDown={handleModalKeyDown}
        >
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            tabIndex={-1} // Ermöglicht Fokus, aber nicht in der Tab-Reihenfolge
          >
            <div className="p-6">
              <h2 id="form-title" className="text-xl font-semibold mb-4">
                {formularOffenId === 'neu' ? 'Neuen Patienten anlegen' : 'Patient bearbeiten'}
              </h2>
              <PatientForm 
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                onCancel={() => setFormularOffenId(null)}
                submitLabel={formularOffenId === 'neu' ? 'Anlegen' : 'Speichern'}
              />
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Patient löschen"
          message="Sind Sie sicher, dass Sie diesen Patienten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
          confirmLabel="Löschen"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
          variant="danger"
        />
      )}
    </main>
  );
}
