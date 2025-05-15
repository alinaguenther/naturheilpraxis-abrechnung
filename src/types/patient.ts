import type { Karteieintrag } from './karteieintrag';

export enum Geschlecht {
  MAENNLICH = 'männlich',
  WEIBLICH = 'weiblich',
  DIVERS = 'divers'
}

export interface Patient {
  id: string;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  geschlecht: 'männlich' | 'weiblich' | 'divers';
  kartei: Karteieintrag[];
}