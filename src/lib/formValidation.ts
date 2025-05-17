import { Patient } from '@/types/patient';
import { FormPath } from '@/types/patientForm';

const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
  },
  plz: {
    pattern: /^\d{5}$/,
    message: 'Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern)'
  },
  hausnummer: {
    pattern: /^[0-9]+[a-zA-Z]?$/,
    message: 'Bitte geben Sie eine gültige Hausnummer ein (z.B. 42 oder 42b)'
  },
  telefon: {
    pattern: /^[0-9\s\-\+\(\)]+$/,
    message: 'Bitte geben Sie eine gültige Telefonnummer ein'
  }
};

export const getRequiredFieldErrors = (
  form: Omit<Patient, 'id'>,
  requiredFields: Array<{ path: FormPath; label: string }>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  requiredFields.forEach(({ path, label }) => {
    const value = path.includes('.')
      ? (() => {
          const [group, key] = path.split('.');
          const groupObj = form[group as keyof typeof form];
          return typeof groupObj === 'object' && groupObj !== null
            ? (groupObj as Record<string, any>)[key]
            : undefined;
        })()
      : form[path as keyof typeof form];
      
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors[path] = `${label} ist erforderlich`;
    }
  });
  
  return errors;
};

export const validatePatternFields = (
  form: Omit<Patient, 'id'>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (form.kontakt?.email && !VALIDATION_RULES.email.pattern.test(form.kontakt.email)) {
    errors['kontakt.email'] = VALIDATION_RULES.email.message;
  }
  
  if (form.anschrift?.plz && !VALIDATION_RULES.plz.pattern.test(form.anschrift.plz)) {
    errors['anschrift.plz'] = VALIDATION_RULES.plz.message;
  }
  
  if (form.anschrift?.hausnummer && !VALIDATION_RULES.hausnummer.pattern.test(form.anschrift.hausnummer)) {
    errors['anschrift.hausnummer'] = VALIDATION_RULES.hausnummer.message;
  }
  
  if (form.kontakt?.telefon && !VALIDATION_RULES.telefon.pattern.test(form.kontakt.telefon)) {
    errors['kontakt.telefon'] = VALIDATION_RULES.telefon.message;
  }
  
  if (form.kontakt?.mobil && !VALIDATION_RULES.telefon.pattern.test(form.kontakt.mobil)) {
    errors['kontakt.mobil'] = VALIDATION_RULES.telefon.message;
  }
  
  return errors;
};

export { VALIDATION_RULES };