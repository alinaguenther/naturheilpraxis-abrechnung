import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/layout/Button';
import { FormFieldset } from './FormFieldset';
import { FormField as FieldComponent } from './FormField';
import { PatientFormProps } from '@/types/patientForm';
import { usePatientForm } from '@/hooks/useFormState';
import { 
  personalFields, 
  addressFields, 
  contactFields, 
  otherFields,
  getPatientFieldsets
} from './patientFormFields';

/**
 * PatientForm - Formularelement zum Erstellen und Bearbeiten von Patientendaten
 */
export function PatientForm({ form, setForm, onSubmit, onCancel, submitLabel }: PatientFormProps) {
  const firstInputRef = useRef<HTMLInputElement>(null!) as React.RefObject<HTMLInputElement>;
  const { errors, getFieldValue, handleInputChange, hasFieldError, validateForm } = usePatientForm(form, setForm, onSubmit);

  // Alle Form Fields zusammenfassen
  const allFields = {
    personalFields,
    addressFields,
    contactFields,
    otherFields
  };

  // Fieldsets definieren
  const fieldsets = getPatientFieldsets(allFields);

  // Renderfeld-Funktion
  const renderField = React.useCallback((field: { id: string; label: string; type: string; [key: string]: any }) => {
    const fieldValue = getFieldValue(field.id);
    const fieldErrorMessage = errors[field.id];
    const isError = hasFieldError(field.id);

    // Für verschachtelte Objekte den Wert korrekt abrufen
    const getValue = (path: string): string => {
      if (path.includes('.')) {
        const [group, key] = path.split('.');
        const groupObj = form[group as keyof typeof form];
        return groupObj && typeof groupObj === 'object' 
          ? (groupObj as any)[key] || '' 
          : '';
      }
      return (form[path as keyof typeof form] as string) || '';
    };

    return (
      <FieldComponent
        key={field.id}
        field={field}
        value={getValue(field.id)} // Verwende getValue für verschachtelte Objekte
        hasError={isError}
        errorMessage={fieldErrorMessage}
        onChange={handleInputChange}
        inputRef={field.id === 'vorname' ? firstInputRef : undefined}
      />
    );
  }, [form, getFieldValue, handleInputChange, hasFieldError, errors]);

  // Initialen Fokus setzen
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={validateForm} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4">
        {fieldsets.map((fieldset, index) => (
          <FormFieldset
            key={index}
            index={index}
            title={fieldset.title}
            description={fieldset.description}
            fields={fieldset.fields}
            cols={fieldset.cols}
            errorKey={fieldset.errorKey}
            errorMessage={fieldset.errorKey ? errors[fieldset.errorKey] : undefined}
            renderField={renderField}
          />
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
        >
          Abbrechen
        </Button>
        <Button 
          type="submit"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}