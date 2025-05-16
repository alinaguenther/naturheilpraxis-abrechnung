'use client';

import { useState, useEffect } from 'react';
import { Patient, Geschlecht } from '@/types/patient';

export function usePatients() {
  const [patienten, setPatienten] = useState<Patient[]>([]);
  const [suchbegriff, setSuchbegriff] = useState('');
  const [sortKey, setSortKey] = useState<keyof Patient>('nachname');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [formularOffenId, setFormularOffenId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Patient, 'id'>>(getInitialForm());

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

  const handleEdit = (p: Patient) => {
    setForm({ ...p });
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
        p.email.toLowerCase().includes(q)
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
  };
}

function getInitialForm(): Omit<Patient, 'id'> {
  return {
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
  };
}