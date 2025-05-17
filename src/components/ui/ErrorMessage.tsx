import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  title = 'Ein Fehler ist aufgetreten',
  message,
  onRetry,
  className = ''
}: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FiAlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-1 text-sm text-red-700">{message}</div>
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                className="bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium text-red-800 transition-colors"
                onClick={onRetry}
              >
                Erneut versuchen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}