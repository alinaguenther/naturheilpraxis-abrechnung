import type { Karteieintrag } from './karteieintrag';

export enum Geschlecht {
  MAENNLICH = 'männlich',
  WEIBLICH = 'weiblich',
  DIVERS = 'divers'
}

export type Patient = {
  id: string;
  vorname: string;
  nachname: string;
  adresse: string;
  plz: string;
  ort: string;
  geburtsdatum: string;
  versicherung: string;
  email: string;
  telefon: string;
  mobil: string;
  geschlecht: Geschlecht;
  termine: {
    geplant: string[];
    vergangen: string[];
  };
  kartei: Karteieintrag[];
}