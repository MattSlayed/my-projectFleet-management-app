import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} role="status" aria-label="Loading content">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse bg-neutral-200',
              variants.text,
              i === lines - 1 && 'w-3/4' // Last line shorter
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn('animate-pulse bg-neutral-200', variants[variant], className)}
      style={{ width, height }}
      role="status"
      aria-label="Loading content"
    />
  );
}

export interface SkeletonCardProps {
  hasImage?: boolean;
}

export function SkeletonCard({ hasImage = false }: SkeletonCardProps) {
  return (
    <div className="card p-6 space-y-4" role="status" aria-label="Loading card">
      {hasImage && <Skeleton variant="rectangular" height="200px" />}
      <div className="space-y-3">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" lines={3} />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width="80px" height="32px" />
        <Skeleton variant="rectangular" width="80px" height="32px" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden" role="status" aria-label="Loading table">
      <div className="p-4 border-b border-neutral-200">
        <Skeleton variant="text" width="30%" />
      </div>
      <div className="divide-y divide-neutral-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            <Skeleton variant="circular" width="40px" height="40px" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
