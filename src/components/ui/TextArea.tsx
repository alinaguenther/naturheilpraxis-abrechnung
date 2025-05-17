import { TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500',
        'transition duration-150 ease-in-out w-full resize-none',
        className
      )}
      {...props}
    />
  );
});
TextArea.displayName = 'TextArea';