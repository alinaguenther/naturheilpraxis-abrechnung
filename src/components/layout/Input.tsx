'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { FormError } from './FormError';
import { Tooltip } from './Tooltip';

type InputPropsBase = {
  error?: boolean | string;
  errorMessage?: string;
  description?: string;
  className?: string;
  label?: string;  // Separates Label hinzufügen
};

type InputPropsInput = InputPropsBase & React.InputHTMLAttributes<HTMLInputElement> & { as?: 'input' };
type InputPropsSelect = InputPropsBase & React.SelectHTMLAttributes<HTMLSelectElement> & { as: 'select' };
type InputPropsTextarea = InputPropsBase & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' };

const Input = forwardRef<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  InputPropsInput | InputPropsSelect | InputPropsTextarea
>(function Input(
  { error, errorMessage, description, as = 'input', className, label, ...props }: any,
  ref
) {
  const Component = as;
  
  // Bestimme, ob ein Fehler angezeigt werden soll
  const hasError = !!error;
  // Fehlertext (entweder direkt error als String oder errorMessage)
  const errorText = typeof error === 'string' ? error : errorMessage;
  
  // Label aus props oder label prop verwenden
  const displayLabel = label || props.label;

  const baseClasses = 
    "w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors";
  
  const errorClasses = hasError 
    ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:border-primary-500";

  return (
    <div className="w-full">
      {props.id && displayLabel && (
        <div className="flex items-center mb-1">
          <label htmlFor={props.id} className="text-gray-700 block">
            {displayLabel}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <div className="ml-2 inline-flex items-center">
              <Tooltip content={description} position="right" />
            </div>
          )}
        </div>
      )}

      <Component
        ref={ref}
        className={clsx(
          baseClasses,
          errorClasses,
          className
        )}
        aria-invalid={hasError ? "true" : undefined}
        aria-describedby={description && props.id ? `${props.id}-desc` : undefined}
        {...props}
      />

      <FormError 
        id={props.id ? `${props.id}-error` : undefined}
        message={errorText}
        show={hasError}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;