'use client';

import React, { forwardRef, createElement } from 'react'
import type { ButtonHTMLAttributes, ElementType } from 'react'
import type { JSX } from 'react';
import clsx from 'clsx';

// ButtonProps und alle Attribute, die ein Element vom Typ T haben kann
type ButtonProps<T extends ElementType = 'button'> = {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'default' | 'icon' 
  as?: T
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement> & 
  (T extends 'button' 
    ? {} 
    : Omit<React.ComponentPropsWithoutRef<T>, 'ref'>);

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-700 text-white shadow',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-700'
}

const sizes = {
  default: 'px-5 py-2',
  icon: 'p-1.5'
}

type PolymorphicRef<T extends ElementType> = React.ComponentPropsWithRef<T>['ref'];

const ButtonComponent = forwardRef(
  function Button<T extends ElementType = 'button'>({ 
    variant = 'primary', 
    size = 'default',
    className = '', 
    type = 'button',
    as,
    ...props 
  }: ButtonProps<T>, ref: PolymorphicRef<T>) {
    const Element = as || 'button';
    const baseStyles = clsx(
      'rounded transition-colors',
      variants[variant], 
      sizes[size], 
      className
    );
    
    return createElement(Element, {
      ref,
      type: Element === 'button' ? type : undefined,
      'data-lastpass-ignore': true,
      className: baseStyles,
      ...props
    });
  }
);

ButtonComponent.displayName = 'Button';

export const Button = ButtonComponent as <T extends ElementType = 'button'>(
  props: ButtonProps<T> & { ref?: PolymorphicRef<T> }
) => JSX.Element;