import { Patient, Geschlecht } from '@/types/patient';
import { Button } from '@/components/ui/Button';

export interface PatientFormProps {
  form: Omit<Patient, 'id'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Patient, 'id'>>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}

export function PatientForm({ form, setForm, onSubmit, onCancel, submitLabel }: PatientFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input className="border p-2 rounded" placeholder="Vorname" value={form.vorname} onChange={(e) => setForm({ ...form, vorname: e.target.value })} />
      <input className="border p-2 rounded" placeholder="Nachname" value={form.nachname} onChange={(e) => setForm({ ...form, nachname: e.target.value })} />
      <input className="border p-2 rounded" placeholder="Adresse" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
      <input className="border p-2 rounded" placeholder="PLZ" value={form.plz} onChange={(e) => setForm({ ...form, plz: e.target.value })} />
      <input className="border p-2 rounded" placeholder="Ort" value={form.ort} onChange={(e) => setForm({ ...form, ort: e.target.value })} />
      <input className="border p-2 rounded" type="date" value={form.geburtsdatum} onChange={(e) => setForm({ ...form, geburtsdatum: e.target.value })} />
      <input className="border p-2 rounded" placeholder="E-Mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="border p-2 rounded" placeholder="Telefon" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} />
      <input className="border p-2 rounded" placeholder="Mobil" value={form.mobil} onChange={(e) => setForm({ ...form, mobil: e.target.value })} />
      <select className="border p-2 rounded" value={form.geschlecht} onChange={(e) => setForm({ ...form, geschlecht: e.target.value as Geschlecht })}>
        <option value={Geschlecht.MAENNLICH}>Männlich</option>
        <option value={Geschlecht.WEIBLICH}>Weiblich</option>
        <option value={Geschlecht.DIVERS}>Divers</option>
      </select>
      <div className="col-span-full flex gap-2">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onCancel}
        >
          Abbrechen
        </Button>
      </div>
    </form>
  );
}