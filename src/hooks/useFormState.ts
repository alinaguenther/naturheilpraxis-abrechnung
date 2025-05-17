import { useState, useCallback } from 'react';
import { Patient, hasValidContactInfo } from '@/types/patient';
import { FormPath } from '@/types/patientForm';
import { getRequiredFieldErrors, validatePatternFields } from '@/lib/formValidation';

export const usePatientForm = (
  form: Omit<Patient, 'id'>,
  setForm: React.Dispatch<React.SetStateAction<Omit<Patient, 'id'>>>,
  onSubmit: (e: React.FormEvent) => void
) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getFieldValue = useCallback((path: FormPath): string => {
    if (path.includes('.')) {
      const [group, key] = path.split('.');
      const groupObj = form[group as keyof typeof form] as Record<string, any>;
      return groupObj?.[key] || '';
    }
    return (form[path as keyof typeof form] as string) || '';
  }, [form]);

  const handleInputChange = useCallback((field: FormPath, value: string) => {
    if (field.includes('.')) {
      const [group, key] = field.split('.');
      setForm(prev => ({
        ...prev,
        [group]: {
          ...((prev[group as keyof typeof prev] && typeof prev[group as keyof typeof prev] === 'object') 
            ? prev[group as keyof typeof prev] as object 
            : {}
          ),
          [key]: value
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  }, [setForm]);

  const hasFieldError = useCallback((fieldId: string): boolean => {
    if (errors[fieldId]) {
      return true;
    }
    
    // Bei Kontaktfeldern auch den allgemeinen Kontaktfehler berücksichtigen
    if (errors.contactInfo && 
       (fieldId === 'kontakt.email' || fieldId === 'kontakt.telefon' || fieldId === 'kontakt.mobil')) {
      return true;
    }
    
    return false;
  }, [errors]);

  const validateContactInfo = useCallback((errorObj: Record<string, string>) => {
    if (!hasValidContactInfo(form.kontakt)) {
      errorObj.contactInfo = 'Mindestens eine Kontaktmöglichkeit (E-Mail, Telefon oder Mobil) muss angegeben werden';
    }
  }, [form.kontakt]);

  const validateForm = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Pflichtfelder validieren
    const requiredFields = [
      { path: 'vorname', label: 'Vorname' },
      { path: 'nachname', label: 'Nachname' },
      { path: 'geburtsdatum', label: 'Geburtsdatum' },
      { path: 'anschrift.adresse', label: 'Straße' },
      { path: 'anschrift.hausnummer', label: 'Hausnummer' },
      { path: 'anschrift.plz', label: 'PLZ' },
      { path: 'anschrift.ort', label: 'Ort' },
      { path: 'versicherung', label: 'Versicherung' },
      { path: 'geschlecht', label: 'Geschlecht' }
    ];
    
    const requiredErrors = getRequiredFieldErrors(form, requiredFields);
    const patternErrors = validatePatternFields(form);
    
    // Alle Fehler vereinigen
    let newErrors = {
      ...requiredErrors,
      ...patternErrors
    };
    
    // Spezielle Validierungen
    if (form.geschlecht === '') {
      newErrors.geschlecht = 'Bitte wählen Sie ein Geschlecht aus';
    }
    
    // Kontaktinformationen validieren
    validateContactInfo(newErrors);
    
    setErrors(newErrors);
    
    // Wenn keine Fehler auftreten, Formular absenden
    if (Object.keys(newErrors).length === 0) {
      onSubmit(e);
    }
  }, [form, validateContactInfo, onSubmit]);

  return {
    errors,
    getFieldValue,
    handleInputChange,
    hasFieldError,
    validateForm
  };
};