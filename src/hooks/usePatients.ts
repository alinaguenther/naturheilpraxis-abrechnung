'use client';

import { useState, useEffect, useCallback } from 'react';
import { Patient, getInitialForm } from '@/types/patient';
import * as patientService from '@/services/patientService';

export function usePatients() {
  const [patienten, setPatienten] = useState<Patient[]>([]);
  const [suchbegriff, setSuchbegriff] = useState('');
  const [sortKey, setSortKey] = useState<keyof Patient>('nachname');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [formularOffenId, setFormularOffenId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Patient, 'id'>>(getInitialForm());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatienten = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await patientService.getAllPatients();
      setPatienten(data);
    } catch (err) {
      console.error('Fehler beim Laden der Patienten:', err);
      setError('Patienten konnten nicht geladen werden');
      setPatienten([]);
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
      await patientService.deletePatient(id);
      setPatienten((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Fehler beim Löschen des Patienten:', err);
      setError('Patient konnte nicht gelöscht werden');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNewPatient = formularOffenId === 'neu';
    
    try {
      if (isNewPatient) {
        const newPatient = await patientService.createPatient(form);
        setPatienten((prev) => [...prev, newPatient]);
      } else if (formularOffenId) {
        const updatedPatient = await patientService.updatePatient(formularOffenId, form);
        if (updatedPatient) {
          setPatienten((prev) => 
            prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
          );
        }
      }
      
      setFormularOffenId(null);
      setForm(getInitialForm());
    } catch (err) {
      console.error('Fehler beim Speichern des Patienten:', err);
      setError('Patient konnte nicht gespeichert werden');
    }
  };

  const getSortedAndFiltered = useCallback(() => {
    const sorted = [...patienten].sort((a, b) => {
      const aVal = (a[sortKey] ?? '').toString().toLowerCase();
      const bVal = (b[sortKey] ?? '').toString().toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    if (!suchbegriff) return sorted;
    
    const q = suchbegriff.toLowerCase();
    return sorted.filter((p) => {
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
  }, [patienten, sortKey, sortOrder, suchbegriff]);

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
    error,
    refresh: fetchPatienten,
  };
}