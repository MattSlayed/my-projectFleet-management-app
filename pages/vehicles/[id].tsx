import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Vehicle, MaintenanceRecord, Trip } from '@/types';
import { Car, Calendar, Gauge, DollarSign, Wrench, MapPin } from 'lucide-react';
import { formatCurrency, formatShortDate, formatNumber } from '@/lib/utils';

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchVehicle = useCallback(async () => {
    try {
      const response = await fetch(`/api/vehicles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVehicle(data);
      } else {
        router.push('/vehicles');
      }
    } catch (error) {
      console.error('Failed to fetch vehicle:', error);
      router.push('/vehicles');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id, fetchVehicle]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return null;
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    retired: 'bg-gray-100 text-gray-800',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{vehicle.name}</h1>
            <p className="mt-2 text-gray-600">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              statusColors[vehicle.status as keyof typeof statusColors]
            }`}
          >
            {vehicle.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mileage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(vehicle.mileage)}
                </p>
              </div>
              <Gauge className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Purchase Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(vehicle.purchasePrice)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Service</p>
                <p className="text-lg font-bold text-gray-900">
                  {vehicle.lastServiceDate
                    ? formatShortDate(vehicle.lastServiceDate)
                    : 'N/A'}
                </p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Service</p>
                <p className="text-lg font-bold text-gray-900">
                  {vehicle.nextServiceDate
                    ? formatShortDate(vehicle.nextServiceDate)
                    : 'N/A'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">License Plate</dt>
                <dd className="text-sm font-medium text-gray-900">{vehicle.licensePlate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">VIN</dt>
                <dd className="text-sm font-medium text-gray-900">{vehicle.vin}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Fuel Type</dt>
                <dd className="text-sm font-medium text-gray-900">{vehicle.fuelType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Purchase Date</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {formatShortDate(vehicle.purchaseDate)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Maintenance ({vehicle.maintenanceRecords?.length || 0})
            </h2>
            {vehicle.maintenanceRecords && vehicle.maintenanceRecords.length > 0 ? (
              <div className="space-y-3">
                {vehicle.maintenanceRecords.slice(0, 5).map((record: MaintenanceRecord) => (
                  <div key={record.id} className="border-l-2 border-primary-500 pl-3">
                    <p className="text-sm font-medium text-gray-900">{record.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatShortDate(record.serviceDate)} - {formatCurrency(record.cost)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No maintenance records yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Trips ({vehicle.trips?.length || 0})
          </h2>
          {vehicle.trips && vehicle.trips.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicle.trips.map((trip: Trip) => (
                    <tr key={trip.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatShortDate(trip.startDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {trip.startLocation} → {trip.endLocation || 'In progress'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{trip.purpose}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            trip.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No trips recorded yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
