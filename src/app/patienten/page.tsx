'use client';

import { useEffect, useState } from 'react';
import { Patient, Geschlecht } from '@/types/patient';
import Link from 'next/link';

type SortKey = keyof Patient;
type SortOrder = 'asc' | 'desc';

export default function PatientenSeite() {
  const [patienten, setPatienten] = useState<Patient[]>([]);
  const [suchbegriff, setSuchbegriff] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('nachname');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [formularOffenId, setFormularOffenId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Patient>>({});

  useEffect(() => {
    fetch('/api/patienten')
      .then(res => res.json())
      .then(setPatienten);
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const gefiltertUndSortiert = [...patienten]
    .filter(p => {
      const q = suchbegriff.toLowerCase();
      return (
        p.vorname.toLowerCase().includes(q) ||
        p.nachname.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const valA = String(a[sortKey] ?? '').toLowerCase();
      const valB = String(b[sortKey] ?? '').toLowerCase();
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  const handleEdit = (p: Patient) => {
    setForm({ ...p });
    setFormularOffenId(p.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) return;

    const res = await fetch(`/api/patienten/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const aktualisiert = await res.json();
    setPatienten(prev => prev.map(p => (p.id === aktualisiert.id ? aktualisiert : p)));
    setFormularOffenId(null);
    setForm({});
  };

    return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold text-green-900 text-center">Patientenübersicht</h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Suche nach Name oder E-Mail"
          value={suchbegriff}
          onChange={(e) => setSuchbegriff(e.target.value)}
          className="w-full md:flex-1 border rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="overflow-x-auto shadow ring-1 ring-gray-200 rounded-lg">
        <table className="min-w-full bg-white rounded text-sm">
          <thead className="bg-green-100 sticky top-0 z-10">
            <tr className="text-left text-green-900 font-semibold">
              {[
                ['nachname', 'Name'],
                ['adresse', 'Adresse'],
                ['plz', 'PLZ'],
                ['ort', 'Ort'],
                ['geburtsdatum', 'Geburtsdatum'],
                ['email', 'E-Mail'],
                ['telefon', 'Telefon'],
                ['mobil', 'Mobil'],
              ].map(([key, label]) => (
                <th key={key} onClick={() => handleSort(key as SortKey)} className="p-3 cursor-pointer hover:underline whitespace-nowrap">
                  {label} {sortKey === key && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
              ))}
              <th className="p-3">Aktion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {gefiltertUndSortiert.map(p => (
              <>
                <tr key={p.id}>
                  <td className="p-3 whitespace-nowrap">{`${p.nachname}, ${p.vorname}`}</td>
                  <td className="p-3 whitespace-nowrap">{p.adresse}</td>
                  <td className="p-3 whitespace-nowrap">{p.plz}</td>
                  <td className="p-3 whitespace-nowrap">{p.ort}</td>
                  <td className="p-3 whitespace-nowrap">{p.geburtsdatum}</td>
                  <td className="p-3 whitespace-nowrap">{p.email}</td>
                  <td className="p-3 whitespace-nowrap">{p.telefon}</td>
                  <td className="p-3 whitespace-nowrap">{p.mobil}</td>
                  <td className="p-3 whitespace-nowrap flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-xs"
                      onClick={() => handleEdit(p)}
                    >
                      Bearbeiten
                    </button>
                    <Link
                      href={`/patienten/${p.id}/kartei`}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs"
                    >
                      Kartei
                    </Link>
                  </td>
                </tr>

                {formularOffenId === p.id && (
                  <tr className="bg-green-50">
                    <td colSpan={9} className="p-4">
                      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input className="border p-2 rounded" placeholder="Vorname" value={form.vorname || ''} onChange={e => setForm({ ...form, vorname: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Nachname" value={form.nachname || ''} onChange={e => setForm({ ...form, nachname: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Adresse" value={form.adresse || ''} onChange={e => setForm({ ...form, adresse: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="PLZ" value={form.plz || ''} onChange={e => setForm({ ...form, plz: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Ort" value={form.ort || ''} onChange={e => setForm({ ...form, ort: e.target.value })} />
                        <input className="border p-2 rounded" type="date" value={form.geburtsdatum || ''} onChange={e => setForm({ ...form, geburtsdatum: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Versicherung" value={form.versicherung || ''} onChange={e => setForm({ ...form, versicherung: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Telefon" value={form.telefon || ''} onChange={e => setForm({ ...form, telefon: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Mobil" value={form.mobil || ''} onChange={e => setForm({ ...form, mobil: e.target.value })} />
                        <input className="border p-2 rounded col-span-2" placeholder="E-Mail" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
                        <select
                          value={form.geschlecht || Geschlecht.DIVERS}
                          onChange={e => setForm({ ...form, geschlecht: e.target.value as Geschlecht })}
                          className="border p-2 rounded"
                        >
                          <option value={Geschlecht.MAENNLICH}>Männlich</option>
                          <option value={Geschlecht.WEIBLICH}>Weiblich</option>
                          <option value={Geschlecht.DIVERS}>Divers</option>
                        </select>

                        <div className="col-span-full flex gap-2 mt-2">
                          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Speichern
                          </button>
                          <button type="button" onClick={() => setFormularOffenId(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                            Abbrechen
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
