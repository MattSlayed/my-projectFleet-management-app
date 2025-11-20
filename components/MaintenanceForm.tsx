import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { maintenanceSchema } from '@/lib/validations';

// Make vehicleId optional for the form (will be passed separately)
const maintenanceFormSchema = maintenanceSchema.extend({
  vehicleId: z.string().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceFormSchema>;

interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface MaintenanceFormProps {
  vehicleId?: string;
  maintenance?: any;
  onSubmit: (data: MaintenanceFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function MaintenanceForm({
  vehicleId,
  maintenance,
  onSubmit,
  onCancel,
  loading = false,
}: MaintenanceFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(!vehicleId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: maintenance
      ? {
          vehicleId: maintenance.vehicleId,
          type: maintenance.type,
          description: maintenance.description,
          cost: maintenance.cost,
          mileage: maintenance.mileage,
          serviceDate: new Date(maintenance.serviceDate).toISOString().split('T')[0],
          servicedBy: maintenance.servicedBy,
          notes: maintenance.notes || '',
        }
      : {
          vehicleId: vehicleId || '',
          type: 'routine',
          serviceDate: new Date().toISOString().split('T')[0],
        },
  });

  useEffect(() => {
    if (!vehicleId) {
      fetchVehicles();
    }
  }, [vehicleId]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!vehicleId && (
            <div>
              <label
                htmlFor="vehicleId"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Vehicle <span className="text-error-600">*</span>
              </label>
              <select
                id="vehicleId"
                {...register('vehicleId', { required: 'Vehicle is required' })}
                disabled={loading || loadingVehicles}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} - {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                  </option>
                ))}
              </select>
              {errors.vehicleId && (
                <p className="mt-1 text-sm text-error-600">{errors.vehicleId.message}</p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Service Type <span className="text-error-600">*</span>
            </label>
            <select
              id="type"
              {...register('type')}
              disabled={loading}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
            >
              <option value="routine">Routine Maintenance</option>
              <option value="repair">Repair</option>
              <option value="inspection">Inspection</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-error-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <Input
              label="Description"
              id="description"
              {...register('description')}
              error={errors.description?.message}
              placeholder="e.g., Oil change and filter replacement"
              disabled={loading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Cost (ZAR)"
                id="cost"
                type="number"
                step="0.01"
                {...register('cost', { valueAsNumber: true })}
                error={errors.cost?.message}
                placeholder="0.00"
                disabled={loading}
                required
              />
            </div>

            <div>
              <Input
                label="Mileage (km)"
                id="mileage"
                type="number"
                step="0.1"
                {...register('mileage', { valueAsNumber: true })}
                error={errors.mileage?.message}
                placeholder="0"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Service Date"
                id="serviceDate"
                type="date"
                {...register('serviceDate')}
                error={errors.serviceDate?.message}
                disabled={loading}
                required
              />
            </div>

            <div>
              <Input
                label="Serviced By"
                id="servicedBy"
                {...register('servicedBy')}
                error={errors.servicedBy?.message}
                placeholder="e.g., ABC Auto Shop"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Notes <span className="text-neutral-400">(Optional)</span>
            </label>
            <textarea
              id="notes"
              {...register('notes')}
              rows={3}
              disabled={loading}
              placeholder="Additional notes about the service..."
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed resize-none"
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-error-600">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading || (loadingVehicles && !vehicleId)}
            >
              {maintenance ? 'Update Record' : 'Add Record'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
