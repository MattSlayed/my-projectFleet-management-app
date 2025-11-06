import { Vehicle } from '@/types';
import { Car, Calendar, Gauge, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatShortDate, formatNumber } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  retired: 'bg-gray-100 text-gray-800',
};

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const needsMaintenance =
    vehicle.nextServiceDate &&
    new Date(vehicle.nextServiceDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Car className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
              <p className="text-sm text-gray-500">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusColors[vehicle.status]
            }`}
          >
            {vehicle.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">License:</span>
            <span className="ml-2">{vehicle.licensePlate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Gauge className="h-4 w-4 mr-2" />
            <span>{formatNumber(vehicle.mileage)} miles</span>
          </div>
          {vehicle.nextServiceDate && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span className={needsMaintenance ? 'text-yellow-600 font-medium' : 'text-gray-600'}>
                Next service: {formatShortDate(vehicle.nextServiceDate)}
              </span>
              {needsMaintenance && <AlertCircle className="h-4 w-4 ml-2 text-yellow-600" />}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
