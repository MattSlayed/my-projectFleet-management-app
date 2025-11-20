import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, icon, children, ...props }, ref) => {
    const variants = {
      default: 'bg-neutral-100 text-neutral-800 border-neutral-200',
      primary: 'bg-primary-100 text-primary-800 border-primary-200',
      success: 'bg-success-100 text-success-800 border-success-200',
      warning: 'bg-warning-100 text-warning-800 border-warning-200',
      error: 'bg-error-100 text-error-800 border-error-200',
      info: 'bg-info-100 text-info-800 border-info-200',
      secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };

    const dotColors = {
      default: 'bg-neutral-600',
      primary: 'bg-primary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      error: 'bg-error-600',
      info: 'bg-info-600',
      secondary: 'bg-secondary-600',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-medium rounded-full border',
          'transition-colors duration-150',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
