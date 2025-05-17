import type { Karteieintrag } from './karteieintrag';

export enum Geschlecht {
  MAENNLICH = 'männlich',
  WEIBLICH = 'weiblich',
  DIVERS = 'divers'
}

export interface Anschrift {
  adresse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  adresseZusatz?: string;
}

export interface Kontaktdaten {
  telefon?: string;
  mobil?: string;
  email?: string;
}

export interface Patient {
  id: string;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  geschlecht: Geschlecht | '';
  anschrift: Anschrift;
  kontakt: Kontaktdaten;
  versicherung: string;
  termine: {
    geplant: string[];
    vergangen: string[];
  };
  kartei: Karteieintrag[];
}

// Hilfsfunktion zur Prüfung der Kontaktinformationen
export function hasValidContactInfo(kontakt?: { email?: string; telefon?: string; mobil?: string }): boolean {
  if (!kontakt) return false;
  
  const { email, telefon, mobil } = kontakt;
  
  // Mindestens ein Feld muss ausgefüllt sein
  return !!(
    (email && email.trim()) || 
    (telefon && telefon.trim()) || 
    (mobil && mobil.trim())
  );
}

// Initiale Form erweitern
export function getInitialForm(): Omit<Patient, 'id'> {
  return {
    vorname: '',
    nachname: '',
    geburtsdatum: '',
    geschlecht: '',
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