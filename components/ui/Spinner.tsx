import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <Loader2
      className={cn('animate-spin text-primary-600', sizes[size], className)}
      aria-label={label}
      role="status"
    />
  );
}

export interface LoadingOverlayProps {
  show: boolean;
  label?: string;
  backdrop?: boolean;
}

export function LoadingOverlay({ show, label = 'Loading', backdrop = true }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex items-center justify-center',
        backdrop && 'bg-white/80 backdrop-blur-sm'
      )}
      role="alert"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" label={label} />
        <p className="text-sm font-medium text-secondary-700">{label}</p>
      </div>
    </div>
  );
}
