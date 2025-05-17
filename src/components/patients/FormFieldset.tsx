import React from 'react';
import { FormField } from '@/types/patientForm';

interface FormFieldsetProps {
  title: string;
  description?: string;
  fields: FormField[];
  cols: number;
  errorKey?: string;
  errorMessage?: string;
  renderField: (field: FormField) => React.ReactNode;
  index: number;
}

export const FormFieldset: React.FC<FormFieldsetProps> = ({
  title, 
  description, 
  fields, 
  cols, 
  errorKey, 
  errorMessage,
  renderField,
  index
}) => {
  return (
    <fieldset 
      className="md:col-span-2 border border-gray-200 rounded-md p-4 mb-2"
      aria-labelledby={`fieldset-${index}-title`}
    >
      <legend 
        id={`fieldset-${index}-title`} 
        className="text-lg font-medium text-primary-700 px-2"
      >
        {title}
      </legend>
      
      {description && (
        <div 
          className="mb-4 text-sm text-primary-700"
          id={`fieldset-${index}-desc`}
        >
          {description}
        </div>
      )}
      
<div 
  className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}
  aria-describedby={description ? `fieldset-${index}-desc` : undefined}
>
  {fields.map(renderField)}
</div>
      
      {errorKey && errorMessage && (
        <div 
          className="mt-3" 
          id={`${errorKey}-error`}
        >
          <p className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        </div>
      )}
    </fieldset>
  );
};