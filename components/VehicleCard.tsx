import { Vehicle } from '@/types';
import { Car, Calendar, Gauge, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatShortDate, formatNumber, cn } from '@/lib/utils';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const statusConfig = {
  active: { variant: 'success' as const, label: 'Active' },
  maintenance: { variant: 'warning' as const, label: 'Maintenance' },
  retired: { variant: 'secondary' as const, label: 'Retired' },
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const needsMaintenance =
    vehicle.nextServiceDate &&
    new Date(vehicle.nextServiceDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const status = statusConfig[vehicle.status];

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="block group">
      <Card
        hover
        className="group-focus-visible:ring-2 group-focus-visible:ring-primary-500 group-focus-visible:ring-offset-2"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 p-3 bg-primary-100 rounded-xl transition-colors group-hover:bg-primary-200">
              <Car className="h-6 w-6 text-primary-600" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 truncate group-hover:text-primary-600 transition-colors">
                {vehicle.name}
              </h3>
              <p className="text-sm text-neutral-600 truncate">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <Badge variant={status.variant} dot className="flex-shrink-0">
            {status.label}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-neutral-600">
            <span className="font-medium min-w-[80px]">License:</span>
            <span className="font-mono text-neutral-900">{vehicle.licensePlate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Gauge className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="tabular-nums">
              <span className="font-semibold text-neutral-900">{formatNumber(vehicle.mileage)}</span> miles
            </span>
          </div>

          {vehicle.nextServiceDate && (
            <div
              className={cn(
                'flex items-center gap-2 text-sm rounded-md p-2 -mx-2',
                needsMaintenance ? 'bg-warning-50' : ''
              )}
            >
              <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span
                className={cn(
                  'flex-1',
                  needsMaintenance ? 'text-warning-900 font-medium' : 'text-neutral-600'
                )}
              >
                Next service: {formatShortDate(vehicle.nextServiceDate)}
              </span>
              {needsMaintenance && (
                <AlertCircle
                  className="h-4 w-4 text-warning-600 flex-shrink-0"
                  aria-label="Service due soon"
                />
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
