import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

export function Toast({ id, title, description, variant, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Trigger animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  const variants = {
    success: {
      bg: 'bg-success-50 border-success-200',
      icon: <CheckCircle className="h-5 w-5 text-success-600" />,
      title: 'text-success-900',
      description: 'text-success-700',
    },
    error: {
      bg: 'bg-error-50 border-error-200',
      icon: <AlertCircle className="h-5 w-5 text-error-600" />,
      title: 'text-error-900',
      description: 'text-error-700',
    },
    warning: {
      bg: 'bg-warning-50 border-warning-200',
      icon: <AlertTriangle className="h-5 w-5 text-warning-600" />,
      title: 'text-warning-900',
      description: 'text-warning-700',
    },
    info: {
      bg: 'bg-info-50 border-info-200',
      icon: <Info className="h-5 w-5 text-info-600" />,
      title: 'text-info-900',
      description: 'text-info-700',
    },
  };

  const config = variants[variant];

  if (!mounted) return null;

  const toast = (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'pointer-events-auto w-full max-w-sm rounded-lg border shadow-lg p-4',
        'transition-all duration-300 ease-out',
        config.bg,
        isVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-semibold', config.title)}>{title}</p>
          {description && (
            <p className={cn('mt-1 text-sm', config.description)}>{description}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className={cn(
            'flex-shrink-0 rounded-md p-1 transition-colors',
            'hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            variant === 'success' && 'focus-visible:ring-success-500',
            variant === 'error' && 'focus-visible:ring-error-500',
            variant === 'warning' && 'focus-visible:ring-warning-500',
            variant === 'info' && 'focus-visible:ring-info-500'
          )}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return createPortal(
    toast,
    document.getElementById('toast-container') || document.body
  );
}

export function ToastContainer() {
  useEffect(() => {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-tooltip flex flex-col gap-2 pointer-events-none';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
  }, []);

  return null;
}
