'use client';

import { use, useEffect, useState } from 'react';
import { Karteieintrag } from '@/types/karteieintrag';
import { Icd10Eintrag } from '@/types/icd10';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function PatientenKartei({ params }: { params: Promise<{ id: string }> }) {
  const [eintraege, setEintraege] = useState<Karteieintrag[]>([]);
  const [notiz, setNotiz] = useState('');
  const [diagnoseText, setDiagnoseText] = useState('');
  const [diagnosen, setDiagnosen] = useState<Icd10Eintrag[]>([]);
  const [vorschlaege, setVorschlaege] = useState<Icd10Eintrag[]>([]);
  const [icdMap, setIcdMap] = useState<Map<string, Icd10Eintrag>>(new Map());

  const { id } = use(params);
  const { isActive: istDiktierenAktiv, startDictation: handleDiktieren } =
    useSpeechRecognition((text) => setNotiz((prev) => prev + ' ' + text.trim()));

  // ICD-Einträge komplett laden (Map<id, Icd10Eintrag>)
  useEffect(() => {
    const fetchICD = async () => {
      const res = await fetch('/api/icd10');  // Changed from '/data/icd10.json' to '/api/icd10'
      const data: Icd10Eintrag[] = await res.json();
      const map = new Map(data.filter((d) => d.id !== undefined).map((d) => [d.id, d]));
      setIcdMap(map);
    };
    fetchICD();
  }, []);

  useEffect(() => {
    fetch(`/api/patienten/${id}/kartei`)
      .then((res) => res.json())
      .then(setEintraege);
  }, [id]);

  useEffect(() => {
    if (diagnoseText.length < 2) {
      setVorschlaege([]);
      return;
    }

    fetch(`/api/icd10?q=${encodeURIComponent(diagnoseText)}`)
      .then((res) => res.json())
      .then((data: Icd10Eintrag[]) => setVorschlaege(data))
      .catch((err) => {
        console.error('Fehler beim ICD-10 Abruf:', err);
        setVorschlaege([]);
      });
  }, [diagnoseText]);

  const handleDiagnoseAuswahl = (eintrag: Icd10Eintrag) => {
    if (!diagnosen.find((d) => d.id === eintrag.id)) {
      setDiagnosen([...diagnosen, eintrag]);
    }
    setDiagnoseText('');
    setVorschlaege([]);
  };

  const handleDiagnoseEntfernen = (id: string) => {
    setDiagnosen(diagnosen.filter((d) => d.id !== id));
  };

  const handleSpeichern = async () => {
    const neuerEintrag: Karteieintrag = {
      id: crypto.randomUUID(),
      datum: new Date().toISOString(),
      notiz,
      diagnosen: diagnosen
  .map((d) => d.id)
  .filter((id): id is string => typeof id === 'string'),

    };

    await fetch(`/api/patienten/${id}/kartei`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(neuerEintrag),
    });

    setEintraege([neuerEintrag, ...eintraege]);
    setNotiz('');
    setDiagnosen([]);
    setDiagnoseText('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Kartei für Patient #{id}</h1>

      <textarea
        value={notiz}
        onChange={(e) => setNotiz(e.target.value)}
        placeholder="Gesprächsnotiz"
        rows={4}
        className="w-full border p-2"
      />

      <button
        onClick={handleDiktieren}
        className={`mt-2 px-4 py-2 rounded text-white ${istDiktierenAktiv ? 'bg-red-600' : 'bg-blue-600'}`}
      >
        {istDiktierenAktiv ? 'Spricht...' : 'Diktieren'}
      </button>

      <div className="mt-4">
        <input
          value={diagnoseText}
          onChange={(e) => setDiagnoseText(e.target.value)}
          placeholder="ICD-10 Diagnose suchen"
          className="w-full border p-2"
        />
        {vorschlaege.length > 0 && (
          <ul className="border mt-2 rounded bg-white shadow max-h-40 overflow-auto">
            {vorschlaege.map((v) => (
              <li
                key={v.id}
                onClick={() => handleDiagnoseAuswahl(v)}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              >
                <strong>{v.code}</strong> – {v.titel}
              </li>
            ))}
          </ul>
        )}
      </div>

      {diagnosen.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {diagnosen.map((d) => (
            <span
              key={d.id}
              className="bg-gray-200 px-2 py-1 rounded text-sm"
              onClick={() => handleDiagnoseEntfernen(d.id)}
            >
              {d.code} ✕
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleSpeichern}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Eintrag speichern
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Verlauf</h2>
        {eintraege.length === 0 && <p className="text-gray-500">Keine Einträge.</p>}
        <ul className="space-y-4">
          {eintraege.map((e) => (
            <li key={e.id} className="border p-4 rounded bg-white shadow">
              <div className="text-sm text-gray-500">
                {new Date(e.datum).toLocaleString('de-DE')}
              </div>
              <div className="mt-2 space-y-1">
                {e.diagnosen.map((id) => {
                  const eintrag = icdMap.get(id);
                  return (
                    <div key={id} className="text-sm font-medium text-blue-600">
                      {eintrag ? `${eintrag.code} – ${eintrag.titel}` : id}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 whitespace-pre-line">{e.notiz}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
