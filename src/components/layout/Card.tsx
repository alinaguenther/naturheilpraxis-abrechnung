import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={clsx('bg-white shadow-md rounded-lg p-6', className)}>
      {children}
    </div>
  );
};