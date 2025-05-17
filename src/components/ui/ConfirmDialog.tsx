'use client';

import { Button } from './Button';
import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Fokus auf Cancel-Button setzen (sicherer Default)
    if (cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }
    
    // Scrolling verhindern
    document.body.style.overflow = 'hidden';
    
    // Keyboard-Handler für ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);
  
  // Varianten-Styling
  const getVariantStyle = () => {
    switch(variant) {
      case 'danger': return 'bg-red-50 border-red-500';
      case 'warning': return 'bg-amber-50 border-amber-500';
      default: return 'bg-blue-50 border-blue-500';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div 
        ref={dialogRef}
        className={`bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 border-l-4 ${getVariantStyle()}`}
        tabIndex={-1}
      >
        <div className="p-6">
          <h2 id="dialog-title" className="text-xl font-semibold mb-2">
            {title}
          </h2>
          <p id="dialog-message" className="mb-6 text-gray-700">
            {message}
          </p>
          <div className="flex justify-end gap-3">
            <Button
              ref={cancelBtnRef}
              type="button"
              onClick={onCancel}
              variant="secondary"
            >
              Abbrechen
            </Button>
            <Button 
              type="button" 
              onClick={onConfirm}
              variant={variant === 'danger' ? 'primary' : 'secondary'}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}