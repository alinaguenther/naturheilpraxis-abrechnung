import { Karteieintrag } from "./karteieintrag";
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
  geburtstag: string;
  versicherung: string;
  email: string;
  geschlecht: Geschlecht;
  termine: {
    geplant: string[];
    vergangen: string[];
  };
  kartei: Karteieintrag[];
}