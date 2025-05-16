// Patienten-Page mit Sticky-Header, sortierbaren Spalten, Logo-Stil und Inline-Bearbeitung
'use client';

import { useEffect, useState } from 'react';
import { Patient, Geschlecht } from '@/types/patient';
import Link from 'next/link';

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
    const url = formularOffenId ? `/api/patienten/${formularOffenId}` : '/api/patienten';
    const method = formularOffenId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const updated = await res.json();
    setPatienten((prev) =>
      formularOffenId
        ? prev.map((p) => (p.id === updated.id ? updated : p))
        : [...prev, updated]
    );

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
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-4xl font-semibold text-green-900 text-center">Patienten</h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          value={suchbegriff}
          onChange={(e) => setSuchbegriff(e.target.value)}
          placeholder="🔍 Suche nach Name oder E-Mail"
          className="flex-1 border rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={() => setFormularOffenId('neu')}
          className="bg-green-600 text-white rounded px-4 py-2 shadow hover:bg-green-700"
        >
          Neuer Patient
        </button>
      </div>

      <div className="overflow-x-auto ring-1 ring-gray-300 rounded">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-green-100 sticky top-0 z-10">
            <tr>
              {['Nachname', 'Vorname', 'Adresse', 'PLZ', 'Ort', 'Geburtsdatum', 'E-Mail', 'Telefon', 'Mobil'].map((col, idx) => (
                <th
                  key={idx}
                  className="p-3 cursor-pointer whitespace-nowrap"
                  onClick={() => handleSort(col.toLowerCase() as keyof Patient)}
                >
                  {col} {sortKey === col.toLowerCase() && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
              ))}
              <th className="p-3">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <>
                <tr key={p.id}>
                  <td className="p-2">{p.nachname}</td>
                  <td className="p-2">{p.vorname}</td>
                  <td className="p-2">{p.adresse}</td>
                  <td className="p-2">{p.plz}</td>
                  <td className="p-2">{p.ort}</td>
                  <td className="p-2">{p.geburtsdatum}</td>
                  <td className="p-2">{p.email}</td>
                  <td className="p-2">{p.telefon}</td>
                  <td className="p-2">{p.mobil}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(p)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">Bearbeiten</button>
                    <Link href={`/patienten/${p.id}/kartei`} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Kartei</Link>
                  </td>
                </tr>
                {formularOffenId === p.id && (
                  <tr className="bg-green-50">
                    <td colSpan={10} className="p-4">
                      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="border p-2 rounded" placeholder="Vorname" value={form.vorname} onChange={(e) => setForm({ ...form, vorname: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Nachname" value={form.nachname} onChange={(e) => setForm({ ...form, nachname: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Adresse" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="PLZ" value={form.plz} onChange={(e) => setForm({ ...form, plz: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Ort" value={form.ort} onChange={(e) => setForm({ ...form, ort: e.target.value })} />
                        <input className="border p-2 rounded" type="date" value={form.geburtsdatum} onChange={(e) => setForm({ ...form, geburtsdatum: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="E-Mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Telefon" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Mobil" value={form.mobil} onChange={(e) => setForm({ ...form, mobil: e.target.value })} />
                        <select className="border p-2 rounded" value={form.geschlecht} onChange={(e) => setForm({ ...form, geschlecht: e.target.value as Geschlecht })}>
                          <option value={Geschlecht.MAENNLICH}>Männlich</option>
                          <option value={Geschlecht.WEIBLICH}>Weiblich</option>
                          <option value={Geschlecht.DIVERS}>Divers</option>
                        </select>
                        <div className="col-span-full flex gap-2">
                          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Speichern</button>
                          <button type="button" onClick={() => setFormularOffenId(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Abbrechen</button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {formularOffenId === 'neu' && (
              <tr className="bg-green-50">
                <td colSpan={10} className="p-4">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border p-2 rounded" placeholder="Vorname" value={form.vorname} onChange={(e) => setForm({ ...form, vorname: e.target.value })} />
                    <input className="border p-2 rounded" placeholder="Nachname" value={form.nachname} onChange={(e) => setForm({ ...form, nachname: e.target.value })} />
                    <input className="border p-2 rounded" placeholder="Adresse" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
                    <input className="border p-2 rounded" placeholder="PLZ" value={form.plz} onChange={(e) => setForm({ ...form, plz: e.target.value })} />
                    <input className="border p-2 rounded" placeholder="Ort" value={form.ort} onChange={(e) => setForm({ ...form, ort: e.target.value })} />
                    <input className="border p-2 rounded" type="date" value={form.geburtsdatum} onChange={(e) => setForm({ ...form, geburtsdatum: e.target.value })} />
                    <input className="border p-2 rounded" placeholder="E-Mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input className="border p-2 rounded" placeholder="Telefon" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} />
                    <input className="border p-2 rounded" placeholder="Mobil" value={form.mobil} onChange={(e) => setForm({ ...form, mobil: e.target.value })} />
                    <select className="border p-2 rounded" value={form.geschlecht} onChange={(e) => setForm({ ...form, geschlecht: e.target.value as Geschlecht })}>
                      <option value={Geschlecht.MAENNLICH}>Männlich</option>
                      <option value={Geschlecht.WEIBLICH}>Weiblich</option>
                      <option value={Geschlecht.DIVERS}>Divers</option>
                    </select>
                    <div className="col-span-full flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Anlegen</button>
                      <button type="button" onClick={() => setFormularOffenId(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Abbrechen</button>
                    </div>
                  </form>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
