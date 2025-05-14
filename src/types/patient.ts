export type Patient = {
  id: string;
  name: string;
  adresse: string;
  geburtstag: string;
  versicherung: string;
  email: string;
  termine: {
    geplant: string[];
    vergangen: string[];
  };
}