'use client';

import { use, useEffect, useState } from 'react';
import { Karteieintrag } from '@/types/karteieintrag';
import { Patient } from '@/types/patient';
import { ICD10Entry } from '@/types/icd10';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function PatientenKartei({ params }: { params: Promise<{ id: string }> }) {
  const [eintraege, setEintraege] = useState<Karteieintrag[]>([]);
  const [notiz, setNotiz] = useState('');
  const [diagnoseText, setDiagnoseText] = useState('');
  const [diagnosen, setDiagnosen] = useState<string[]>([]);
  const [vorschlaege, setVorschlaege] = useState<string[]>([]);
  
  const { id } = use(params);
  const { isActive: istDiktierenAktiv, startDictation: handleDiktieren } = 
    useSpeechRecognition((text) => setNotiz(prev => prev + ' ' + text.trim()));

  useEffect(() => {
    fetch(`/api/patienten/${id}/kartei`)
      .then((res) => res.json())
      .then(setEintraege);
  }, [id]);

  useEffect(() => {
    const fetchICD = async () => {
      try {
        if (diagnoseText.length > 1) {
          const res = await fetch(`/api/icd10?q=${encodeURIComponent(diagnoseText)}`);
          if (!res.ok) {
            console.error('ICD-10 API Fehler:', res.status, res.statusText);
            return;
          }
        
          const daten = (await res.json()) as ICD10Entry[];
          setVorschlaege(daten.map(d => `${d.code} - ${d.text}`));
        } else {
          setVorschlaege([]);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der ICD-10 Daten:', error);
        setVorschlaege([]);
      }
    };
    fetchICD();
  }, [diagnoseText]);

  const handleSpeichern = async () => {
    const neuerEintrag: Karteieintrag = {
      datum: new Date().toISOString(),
      notiz,
      diagnosen,
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
        className={`mt-2 px-4 py-2 rounded text-white ${
          istDiktierenAktiv ? 'bg-red-600' : 'bg-blue-600'
        }`}
      >
        {istDiktierenAktiv ? 'Spricht...' : 'Diktieren'}
      </button>

      <div className="mt-4">
        <input
          value={diagnoseText}
          onChange={(e) => setDiagnoseText(e.target.value)}
          placeholder="Diagnose (ICD-10)"
          className="w-full border p-2"
        />
        {vorschlaege.length > 0 && (
          <ul className="border mt-2 rounded bg-white shadow max-h-40 overflow-auto">
            {vorschlaege.map((v, i) => (
              <li
                key={i}
                onClick={() => {
                  setDiagnosen([...diagnosen, v]);
                  setDiagnoseText('');
                  setVorschlaege([]);
                }}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {v}
              </li>
            ))}
          </ul>
        )}
      </div>

      {diagnosen.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {diagnosen.map((d, i) => (
            <span
              key={i}
              className="bg-gray-200 px-2 py-1 rounded text-sm"
              onClick={() => setDiagnosen(diagnosen.filter((_, idx) => idx !== i))}
            >
              {d} ✕
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
          {eintraege.map((e, i) => (
            <li key={i} className="border p-4 rounded bg-white shadow">
              <div className="text-sm text-gray-500">
                {new Date(e.datum).toLocaleString('de-DE')}
              </div>
              <div className="mt-2">
                {e.diagnosen.map((d, j) => (
                  <div key={j} className="text-sm font-medium text-blue-600">
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-2 whitespace-pre-line">{e.notiz}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
