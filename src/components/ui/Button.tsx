import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', type = 'button', ...props }, ref) => {
    const baseStyle = "font-medium px-4 py-2 rounded-md shadow-sm focus:outline-none transition"
    const variantStyle = variant === 'primary' ? "" : ""

    return (
      <button
        ref={ref}
        type={type}
        className={clsx(baseStyle, variantStyle, className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'