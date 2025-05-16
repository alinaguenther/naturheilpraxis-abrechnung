import { LabelHTMLAttributes } from 'react';
import clsx from 'clsx';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = ({ className, ...props }: LabelProps) => {
  return (
    <label
      className={clsx(
        'block text-sm font-medium text-gray-700 mb-1',
        className
      )}
      {...props}
    />
  );
};