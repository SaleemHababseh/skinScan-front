import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'input w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-error-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;