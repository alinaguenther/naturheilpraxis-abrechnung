'use client';

import { useState, useEffect, useCallback } from 'react';
import { Patient, Geschlecht } from '@/types/patient';

export function usePatients() {
  const [patienten, setPatienten] = useState<Patient[]>([]);
  const [suchbegriff, setSuchbegriff] = useState('');
  const [sortKey, setSortKey] = useState<keyof Patient>('nachname');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [formularOffenId, setFormularOffenId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Patient, 'id'>>(getInitialForm());
  const [isLoading, setIsLoading] = useState(false);

  const fetchPatienten = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/patienten');
      
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Patienten: ${response.statusText}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('JSON parsing error:', error);
        data = []; // Fallback zu einer leeren Liste
      }
      
      // Validiere, dass ein Array zurückgegeben wurde
      if (!Array.isArray(data)) {
        console.error('API returned invalid data format');
        data = [];
      }
      
      setPatienten(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatienten([]);
      // Optional: Zeige eine Benutzerbenachrichtigung an
      // toast.error('Patientendaten konnten nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatienten();
  }, [fetchPatienten]);

  const handleSort = (key: keyof Patient) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleEdit = (p: Patient) => {
    setForm({
      vorname: p.vorname,
      nachname: p.nachname,
      geburtsdatum: p.geburtsdatum,
      geschlecht: p.geschlecht || '',
      anschrift: {
        adresse: p.anschrift?.adresse || '',
        hausnummer: p.anschrift?.hausnummer || '',
        plz: p.anschrift?.plz || '',
        ort: p.anschrift?.ort || '',
        adresseZusatz: p.anschrift?.adresseZusatz
      },
      kontakt: {
        telefon: p.kontakt?.telefon || '',
        mobil: p.kontakt?.mobil || '',
        email: p.kontakt?.email || ''
      },
      versicherung: p.versicherung || '',
      termine: p.termine || {
        geplant: [],
        vergangen: []
      },
      kartei: p.kartei || []
    });
    setFormularOffenId(p.id);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/patienten/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setPatienten((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNewPatient = formularOffenId === 'neu';
    const url = isNewPatient ? '/api/patienten' : `/api/patienten/${formularOffenId}`;
    const method = isNewPatient ? 'POST' : 'PUT';
  
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  
      const updated = await res.json();
      setPatienten((prev) =>
        isNewPatient ? [...prev, updated] : prev.map((p) => (p.id === updated.id ? updated : p))
      );
  
      setFormularOffenId(null);
      setForm(getInitialForm());
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const getSortedAndFiltered = () => {
    const sorted = [...patienten].sort((a, b) => {
      const aVal = (a[sortKey] ?? '').toString().toLowerCase();
      const bVal = (b[sortKey] ?? '').toString().toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    return sorted.filter((p) => {
      const q = suchbegriff.toLowerCase();
      return (
        p.vorname.toLowerCase().includes(q) ||
        p.nachname.toLowerCase().includes(q) ||
        p.versicherung.toLowerCase().includes(q) ||
        (p.anschrift?.adresse || '').toLowerCase().includes(q) ||
        (p.anschrift?.plz || '').toLowerCase().includes(q) ||
        (p.anschrift?.ort || '').toLowerCase().includes(q) ||
        (p.kontakt?.telefon || '').toLowerCase().includes(q) ||
        (p.kontakt?.mobil || '').toLowerCase().includes(q) ||
        (p.kontakt?.email || '').toLowerCase().includes(q)
      );
    });
  };

  return {
    patienten: getSortedAndFiltered(),
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
    isLoading,
  };
}

// In src/hooks/usePatients.ts

// Aktualisiere diese Funktion
function getInitialForm(): Omit<Patient, 'id'> {
  return {
    vorname: '',
    nachname: '',
    geburtsdatum: '',
    geschlecht: '', // Leerer String entspricht "Bitte wählen"
    anschrift: {
      adresse: '',
      hausnummer: '',
      plz: '',
      ort: '',
      adresseZusatz: ''
    },
    kontakt: {
      telefon: '',
      mobil: '',
      email: ''
    },
    versicherung: '',
    termine: {
      geplant: [],
      vergangen: []
    },
    kartei: []
  };
}