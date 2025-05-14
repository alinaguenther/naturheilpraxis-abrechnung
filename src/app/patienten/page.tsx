// Patienten-Frontend-Seite mit Tabelle, aufklappbarem Formular, Bearbeitung, Suche & Sortierung
'use client';

import { useEffect, useState } from 'react';
import { Patient, Geschlecht } from '@/types/patient';

export default function PatientenSeite() {
  const [patienten, setPatienten] = useState<Patient[]>([]);
  const [suchbegriff, setSuchbegriff] = useState('');
  const [sortiert, setSortiert] = useState<'name-asc' | 'name-desc'>('name-asc');
  const [form, setForm] = useState<Omit<Patient, 'id'>>({
    vorname: '',
    nachname: '',
    adresse: '',
    geburtstag: '',
    versicherung: '',
    email: '',
    geschlecht: Geschlecht.DIVERS, // Default value
    termine: { geplant: [], vergangen: [] },
    kartei: []
  });
  const [bearbeiteId, setBearbeiteId] = useState<string | null>(null);
  const [formularOffen, setFormularOffen] = useState(false);

  useEffect(() => {
    fetch('/api/patienten')
      .then(res => res.json())
      .then(setPatienten);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const methode = bearbeiteId ? 'PUT' : 'POST';
    const url = bearbeiteId ? `/api/patienten/${bearbeiteId}` : '/api/patienten';

    const res = await fetch(url, {
      method: methode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const patient = await res.json();

    if (bearbeiteId) {
      setPatienten(prev => prev.map(p => (p.id === patient.id ? patient : p)));
      setBearbeiteId(null);
    } else {
      setPatienten(prev => [...prev, patient]);
    }

    setFormularOffen(false);
    setForm({ vorname: '',nachname: '', adresse: '', geburtstag: '', versicherung: '', email: '', geschlecht: Geschlecht.DIVERS, termine: { geplant: [], vergangen: [] }, kartei: [] });
  };

  const handleEdit = (patient: Patient) => {
    setForm({
      vorname: patient.vorname,
        nachname: patient.nachname,
      adresse: patient.adresse,
      geburtstag: patient.geburtstag,
      versicherung: patient.versicherung,
      email: patient.email,
      geschlecht: patient.geschlecht,
      termine: patient.termine,
      kartei: patient.kartei
    });
    setBearbeiteId(patient.id);
    setFormularOffen(true);
  };

  const gefiltertUndSortiert = patienten
    .filter(p => {
      const searchTerm = suchbegriff.toLowerCase();
      return (
        (p.vorname?.toLowerCase() || '').includes(searchTerm) ||
        (p.nachname?.toLowerCase() || '').includes(searchTerm) ||
        (p.email?.toLowerCase() || '').includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const nameA = `${a.nachname || ''}, ${a.vorname || ''}`.toLowerCase().trim();
      const nameB = `${b.nachname || ''}, ${b.vorname || ''}`.toLowerCase().trim();
      return sortiert === 'name-asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Patientenverwaltung</h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Suche nach Name oder E-Mail"
          value={suchbegriff}
          onChange={e => setSuchbegriff(e.target.value)}
          className="border p-2 w-full"
        />
        <select
          value={sortiert}
          onChange={e => setSortiert(e.target.value as 'name-asc' | 'name-desc')}
          className="border p-2"
        >
          <option value="name-asc">Sortierung: A–Z</option>
          <option value="name-desc">Sortierung: Z–A</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setFormularOffen(v => !v);
            setForm({ vorname: '', nachname: '', adresse: '', geburtstag: '', versicherung: '', email: '', geschlecht: Geschlecht.DIVERS, termine: { geplant: [], vergangen: [] }, kartei: [] });
            setBearbeiteId(null);
          }}
        >
          {formularOffen ? 'Formular ausblenden' : 'Neuen Patienten anlegen'}
        </button>
      </div>

      {formularOffen && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            className="border p-2" 
            placeholder="Vorname" 
            value={form.vorname} 
            onChange={e => setForm({ ...form, vorname: e.target.value })} 
            required 
          />
          <input 
            className="border p-2" 
            placeholder="Nachname" 
            value={form.nachname} 
            onChange={e => setForm({ ...form, nachname: e.target.value })} 
            required 
          />
          <input className="border p-2" placeholder="Adresse" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} required />
          <input className="border p-2" type="date" value={form.geburtstag} onChange={e => setForm({ ...form, geburtstag: e.target.value })} required />
          <input className="border p-2" placeholder="Versicherung" value={form.versicherung} onChange={e => setForm({ ...form, versicherung: e.target.value })} />
          <input className="border p-2 md:col-span-2" type="email" placeholder="E-Mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <select 
            value={form.geschlecht}
            onChange={(e) => setForm({ ...form, geschlecht: e.target.value as Geschlecht })}
            className="border p-2"
          >
            <option value={Geschlecht.MAENNLICH}>Männlich</option>
            <option value={Geschlecht.WEIBLICH}>Weiblich</option>
            <option value={Geschlecht.DIVERS}>Divers</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-full">
            {bearbeiteId ? 'Patient speichern' : 'Neuen Patienten hinzufügen'}
          </button>
        </form>
      )}

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">Adresse</th>
            <th className="text-left p-2 border">Geburtstag</th>
            <th className="text-left p-2 border">E-Mail</th>
            <th className="text-left p-2 border">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {gefiltertUndSortiert.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2 border">{`${p.nachname}, ${p.vorname}`}</td>
              <td className="p-2 border">{p.adresse}</td>
              <td className="p-2 border">{p.geburtstag}</td>
              <td className="p-2 border">{p.email}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:underline"
                >
                  Bearbeiten
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
