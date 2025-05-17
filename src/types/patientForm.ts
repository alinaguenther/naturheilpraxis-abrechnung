import { Patient } from '@/types/patient';

export type FormPath = string | `${string}.${string}`;
export type FieldValue = string | number | boolean;

export interface FormField {
  id: FormPath;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  as?: 'select' | 'input' | 'textarea';
  options?: Array<{value: string; label: string}>;
  pattern?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  maxLength?: number;
  autoComplete?: string;
  description?: string;
  min?: string;
  max?: string;
}

export interface FieldSet {
  title: string;
  fields: FormField[];
  cols: number;
  description?: string;
  errorKey?: string;
}

export interface PatientFormProps {
  form: Omit<Patient, 'id'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Patient, 'id'>>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}