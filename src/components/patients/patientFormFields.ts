import { FormField, FieldSet } from "@/types/patientForm";

export const personalFields: FormField[] = [
  {
    id: 'vorname',
    label: 'Vorname',
    type: 'text',
    required: true,
    placeholder: 'Max'
  },
  {
    id: 'nachname',
    label: 'Nachname',
    type: 'text',
    required: true,
    placeholder: 'Mustermann'
  },
  {
    id: 'geschlecht',
    label: 'Geschlecht',
    type: 'select',
    required: true,
    as: 'select',
    options: [
      { value: '', label: 'Bitte wählen' },
      { value: 'männlich', label: 'Männlich' },
      { value: 'weiblich', label: 'Weiblich' },
      { value: 'divers', label: 'Divers' }
    ],
    description: 'Wählen Sie das Geschlecht des Patienten'
  },
  {
    id: 'geburtsdatum',
    label: 'Geburtsdatum',
    type: 'date',
    required: true,
    description: 'Format: TT.MM.JJJJ',
    max: new Date().toISOString().split('T')[0]
  }
];

// Bei den addressFields sollten alle benötigten Felder vorhanden sein
export const addressFields: FormField[] = [
  {
    id: 'anschrift.adresse',
    label: 'Straße',
    type: 'text',
    placeholder: 'Musterstraße',
    required: true
  },
  {
    id: 'anschrift.hausnummer',
    label: 'Hausnummer',
    type: 'text',
    placeholder: '123a',
    required: true,
    pattern: '^[0-9]+[a-zA-Z]?$',
    maxLength: 5,
    description: 'Hausnummer, optional mit Buchstabe (z.B. 42b)'
  },
  {
    id: 'anschrift.plz',
    label: 'PLZ',
    type: 'text',
    required: true,
    placeholder: '12345',
    pattern: '[0-9]{5}',
    inputMode: 'numeric',
    maxLength: 5,
    description: 'Fünfstellige Postleitzahl'
  },
  {
    id: 'anschrift.ort',
    label: 'Ort',
    type: 'text',
    placeholder: 'Musterstadt',
    required: true
  },
  {
    id: 'anschrift.adresseZusatz',
    label: 'Adresszusatz',
    type: 'text',
    placeholder: 'z.B. 2. Stock, links'
  }
];

// Bei den contactFields sollten alle Kontaktfelder vorhanden sein
export const contactFields: FormField[] = [
  {
    id: 'kontakt.email',
    label: 'E-Mail',
    type: 'email',
    placeholder: 'max.mustermann@example.com',
    autoComplete: 'email',
    inputMode: 'email'
  },
  {
    id: 'kontakt.telefon',
    label: 'Telefon',
    type: 'tel',
    placeholder: '030 12345678',
    autoComplete: 'tel',
    inputMode: 'tel',
    pattern: '[0-9\\s\\-\\+\\(\\)]+',
    description: 'Nur Ziffern, Leerzeichen und Sonderzeichen (+, -, ())'
  },
  {
    id: 'kontakt.mobil',
    label: 'Mobil',
    type: 'tel',
    placeholder: '0170 1234567',
    autoComplete: 'tel-mobile',
    inputMode: 'tel',
    pattern: '[0-9\\s\\-\\+\\(\\)]+',
    description: 'Nur Ziffern, Leerzeichen und Sonderzeichen (+, -, ())'
  }
];

export const otherFields: FormField[] = [
  {
    id: 'versicherung',
    label: 'Versicherung',
    type: 'text',
    required: true,
    placeholder: 'z.B. AOK, Techniker, Private'
  }
];

export const getPatientFieldsets = (allFields: {
  personalFields: FormField[];
  addressFields: FormField[];
  contactFields: FormField[];
  otherFields: FormField[];
}): FieldSet[] => [
  { 
    title: 'Persönliche Informationen',
    fields: allFields.personalFields,
    cols: 2
  },
  { 
    title: 'Adresse',
    fields: allFields.addressFields,
    cols: 2
  },
  { 
    title: 'Kontaktinformationen',
    fields: allFields.contactFields,
    cols: 3,
    description: 'Bitte geben Sie mindestens eine Kontaktmöglichkeit an (E-Mail, Telefon oder Mobil).',
    errorKey: 'contactInfo'
  },
  { 
    title: 'Zusätzliche Informationen',
    fields: allFields.otherFields,
    cols: 2
  }
];