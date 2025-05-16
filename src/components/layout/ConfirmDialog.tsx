'use client';

import { Button } from '@/components/layout/Button';
import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({ 
  title,
  message,
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    confirmButtonRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      ref={dialogRef}
    >
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onCancel}
        aria-hidden="true"
      />
      
      <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
        <h3 
          id="dialog-title"
          className="text-lg font-semibold mb-4"
        >
          {title}
        </h3>
        <p 
          id="dialog-description"
          className="mb-6"
        >
          {message}
        </p>
        <div className="flex justify-end gap-4">
          <Button
            onClick={onCancel}
            variant="secondary"
            type="button"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant={variant === 'danger' ? 'primary' : 'secondary'}
            type="button"
            ref={confirmButtonRef}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}