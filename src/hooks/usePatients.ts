import { useState, useEffect } from 'react';
import { Patient } from '@/types/patient';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/patienten');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { patients, isLoading, error, setPatients };
}