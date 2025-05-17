'use client';

import React from 'react';
import { clsx } from 'clsx';

type ErrorSeverity = 'error' | 'warning' | 'info';

interface FormErrorProps {
  id?: string;
  message?: string | null;
  show?: boolean;
  severity?: ErrorSeverity;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  id,
  message,
  show = true,
  severity = 'error',
  className,
}) => {
  if (!show || !message) return null;
  
  const severityClasses = {
    error: 'text-red-600',
    warning: 'text-amber-600',
    info: 'text-blue-600'
  };
  
  return (
    <div 
      id={id}
      role="alert"
      className={clsx(
        'text-sm mt-1',
        severityClasses[severity],
        className
      )}
    >
      {message}
    </div>
  );
};