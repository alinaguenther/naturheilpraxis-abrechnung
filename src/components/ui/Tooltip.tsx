'use client';

import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { clsx } from 'clsx';

interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  className = '',
  iconClassName = '',
  tooltipClassName = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'top-1/2 left-full transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'top-1/2 right-full transform -translate-y-1/2 mr-2'
  };
  
  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-700 border-r-transparent border-b-transparent border-l-transparent',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-r-gray-700 border-b-transparent border-l-transparent',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-t-transparent border-r-transparent border-b-gray-700 border-l-transparent',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-r-transparent border-b-transparent border-l-gray-700'
  };

  return (
    <div 
      className={clsx('relative inline-block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <button
        type="button"
        className={clsx(
          'text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary-600',
          'flex items-center justify-center rounded-full',
          iconClassName
        )}
        aria-label="Information anzeigen"
      >
        <FiInfo size={16} />
      </button>
      
      {isVisible && (
        <div 
          role="tooltip"
          className={clsx(
            'absolute z-50 px-2 py-1 text-xs text-white bg-gray-700 rounded shadow-lg max-w-xs',
            positionClasses[position],
            tooltipClassName
          )}
        >
          {content}
          <span
            className={clsx(
              'absolute w-0 h-0',
              'border-4',
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
};