'use client';

import { useEffect, useState } from 'react';
import { Patient, Geschlecht } from '@/types/patient';
import Image from 'next/image';
import Link from 'next/link';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientTable } from '@/components/patients/PatientTable';
import { Button } from '@/components/ui/Button';

export default function PatientenSeite() {
  const [patienten, setPatienten] = useState<Patient[]>([]);
  const [suchbegriff, setSuchbegriff] = useState('');
  const [sortKey, setSortKey] = useState<keyof Patient>('nachname');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [formularOffenId, setFormularOffenId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Patient, 'id'>>({
    vorname: '',
    nachname: '',
    adresse: '',
    plz: '',
    ort: '',
    geburtsdatum: '',
    versicherung: '',
    email: '',
    telefon: '',
    mobil: '',
    geschlecht: Geschlecht.DIVERS,
    termine: { geplant: [], vergangen: [] },
    kartei: [],
  });

  useEffect(() => {
    fetch('/api/patienten')
      .then((res) => res.json())
      .then(setPatienten);
  }, []);

  const handleSort = (key: keyof Patient) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sorted = [...patienten].sort((a, b) => {
    const aVal = (a[sortKey] ?? '').toString().toLowerCase();
    const bVal = (b[sortKey] ?? '').toString().toLowerCase();
    return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const filtered = sorted.filter((p) => {
    const q = suchbegriff.toLowerCase();
    return (
      p.vorname.toLowerCase().includes(q) ||
      p.nachname.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  const handleEdit = (p: Patient) => {
    setForm({ ...p });
    setFormularOffenId(p.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For new patients, formularOffenId will be 'neu'
    const isNewPatient = formularOffenId === 'neu';
    
    const url = isNewPatient ? '/api/patienten' : `/api/patienten/${formularOffenId}`;
    const method = isNewPatient ? 'POST' : 'PUT';
  
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const updated = await res.json();
      setPatienten((prev) =>
        isNewPatient ? [...prev, updated] : prev.map((p) => (p.id === updated.id ? updated : p))
      );
  
      // Reset form and close
      setFormularOffenId(null);
      setForm({
        vorname: '',
        nachname: '',
        adresse: '',
        plz: '',
        ort: '',
        geburtsdatum: '',
        versicherung: '',
        email: '',
        telefon: '',
        mobil: '',
        geschlecht: Geschlecht.DIVERS,
        termine: { geplant: [], vergangen: [] },
        kartei: [],
      });
    } catch (error) {
      console.error('Error saving patient:', error);
      // You might want to add error handling UI here
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE');
  };

  return (
    <main className="min-h-screen">
      <header className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Image 
                src="/pictures/logo.svg"
                alt="Logo"
                width={150}
                height={150}
                priority
              />
            </Link>
          </div>
          <nav>
            <Link 
              href="/"
              className="px-3 py-2 rounded-md"
            >
              Startseite
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Patienten-Verwaltung</h1>
          <p className="mt-2">Verwalten Sie hier Ihre Patientendaten</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <input
            type="text"
            value={suchbegriff}
            onChange={(e) => setSuchbegriff(e.target.value)}
            placeholder="🔍 Suche nach Name oder E-Mail"
            className="flex-1 border rounded-md px-4 py-2 shadow-sm focus:outline-none"
          />
          <Button
            onClick={() => setFormularOffenId('neu')}
            variant="primary"
            type="button"
          >
            Neuer Patient
          </Button>
        </div>

        {formularOffenId === 'neu' && (
          <div className="p-6 rounded-lg shadow-sm mb-8 border">
            <h2 className="text-xl font-semibold mb-4">Neuen Patienten anlegen</h2>
            <PatientForm 
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onCancel={() => setFormularOffenId(null)}
              submitLabel="Anlegen"
            />
          </div>
        )}

        <div className="overflow-x-auto rounded-lg shadow">
          <PatientTable 
            patients={filtered}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={handleEdit}
            formatDate={formatDate}
          />
        </div>
      </div>
    </main>
  );
}
