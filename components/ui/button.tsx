import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'danger';
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
          variant === 'default' && 'bg-primary text-white hover:opacity-90',
          variant === 'outline' && 'border bg-white hover:bg-slate-50',
          variant === 'ghost' && 'hover:bg-slate-100',
          variant === 'danger' && 'bg-danger text-white hover:opacity-90',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
