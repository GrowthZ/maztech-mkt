import * as React from 'react';
import { cn } from '@/lib/utils';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn('flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100', className)}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
