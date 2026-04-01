import * as React from 'react';
import { cn } from '@/lib/utils';

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn('flex h-10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100', className)}
      {...props}
    >
      {children}
    </select>
  );
}
