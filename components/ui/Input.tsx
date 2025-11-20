import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helpText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success,
      helpText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helpTextId = helpText ? `${inputId}-help` : undefined;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-900"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(errorId, helpTextId).trim() || undefined}
            className={cn(
              'input',
              'transition-all duration-150',
              leftIcon && 'pl-10',
              (rightIcon || error || success) && 'pr-10',
              error &&
                'border-error-300 focus-visible:ring-error-500 focus-visible:border-error-500',
              success &&
                'border-success-300 focus-visible:ring-success-500 focus-visible:border-success-500',
              disabled && 'bg-neutral-50 cursor-not-allowed opacity-60',
              className
            )}
            {...props}
          />

          {(rightIcon || error || success) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {error && (
                <AlertCircle
                  className="h-5 w-5 text-error-500"
                  aria-hidden="true"
                />
              )}
              {success && !error && (
                <Check
                  className="h-5 w-5 text-success-500"
                  aria-hidden="true"
                />
              )}
              {rightIcon && !error && !success && (
                <span className="text-neutral-400">{rightIcon}</span>
              )}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="text-sm text-error-600 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={helpTextId} className="text-sm text-neutral-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
