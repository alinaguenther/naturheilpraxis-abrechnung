'use client';

import { forwardRef, createElement } from 'react'
import type { ButtonHTMLAttributes, ElementType } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'icon'
  asChild?: boolean
  as?: ElementType
}

const variants = {
  primary: 'bg-primary hover:bg-primaryDark text-white shadow',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-700'
}

const sizes = {
  default: 'px-5 py-2',
  icon: 'p-1.5'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ 
    variant = 'primary', 
    size = 'default',
    className = '', 
    type = 'button',
    asChild,
    as: Component = 'button',
    ...props 
  }, ref) {
    const Element = asChild ? Component : 'button'
    
    return createElement(Element, {
      ref,
      type: !asChild ? type : undefined,
      'data-lastpass-ignore': true,
      className: `rounded transition-colors ${variants[variant]} ${sizes[size]} ${className}`,
      ...props
    })
  }
)

Button.displayName = 'Button'