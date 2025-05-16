'use client';

import { usePatients } from '@/hooks/usePatients';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/patients/SearchBar';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientTable } from '@/components/patients/PatientTable';
import { ConfirmDialog } from '@/components/layout/ConfirmDialog';

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
    handleEdit,
    handleDelete,
    handleSubmit,
  } = usePatients();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('de-DE');
  };

  return (
    <main className="page-container">
      <Header />

      <section className="section-container">
        <div className="content-wrapper space-y-6">
          <div className="text-center">
            <h1 className="page-title">Patienten-Verwaltung</h1>
            <p className="card-text">Verwalten Sie hier Ihre Patientendaten</p>
          </div>

          <SearchBar
            value={suchbegriff}
            onChange={setSuchbegriff}
            onNewPatient={() => setFormularOffenId('neu')}
          />

          <div className="card">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
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
