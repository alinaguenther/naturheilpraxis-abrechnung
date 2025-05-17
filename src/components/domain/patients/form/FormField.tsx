import React from 'react';
import Input from '@/components/ui/Input';
import { FormField as FormFieldType } from '@/types/patientForm';

interface FormFieldProps {
  field: FormFieldType;
  value: string;
  hasError: boolean;
  errorMessage?: string;
  onChange: (id: string, value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  hasError,
  errorMessage,
  onChange,
  inputRef
}) => {
  const isSelect = field.as === 'select';
  const isTextarea = field.as === 'textarea';
  const isRequired = field.required === true;

  const commonProps = {
    ref: inputRef,
    id: field.id,
    name: field.id,
    required: isRequired,
    label: field.label,
    value: value,
    error: hasError,
    errorMessage: errorMessage,
    description: field.description
  };

  if (isSelect) {
    return (
      <div className="form-group">
        <Input
          {...commonProps}
          as="select"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onChange(field.id, e.target.value)}
        >
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Input>
      </div>
    );
  }

  if (isTextarea) {
    return (
      <div className="form-group">
        <Input
          {...commonProps}
          as="textarea"
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange(field.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="form-group">
      <Input
        {...commonProps}
        as="input"
        type={field.type}
        placeholder={field.placeholder}
        pattern={field.pattern}
        inputMode={field.inputMode}
        maxLength={field.maxLength}
        autoComplete={field.autoComplete}
        min={field.min}
        max={field.max}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(field.id, e.target.value)}
      />
    </div>
  );
};