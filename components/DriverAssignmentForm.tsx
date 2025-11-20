import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';

const assignmentSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: string;
}

interface DriverAssignmentFormProps {
  userId: string;
  onSubmit: (data: AssignmentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DriverAssignmentForm({
  userId,
  onSubmit,
  onCancel,
  loading = false,
}: DriverAssignmentFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetchAvailableVehicles();
  }, []);

  const fetchAvailableVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        // Filter for active vehicles only
        setVehicles(data.filter((v: Vehicle) => v.status === 'active'));
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
          <div>
            <label
              htmlFor="vehicleId"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Vehicle <span className="text-error-600">*</span>
            </label>
            <select
              id="vehicleId"
              {...register('vehicleId')}
              disabled={loading || loadingVehicles}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.licensePlate}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="mt-1 text-sm text-error-600">{errors.vehicleId.message}</p>
            )}
            {!loadingVehicles && vehicles.length === 0 && (
              <p className="mt-1 text-sm text-warning-600">
                No active vehicles available for assignment
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Start Date <span className="text-error-600">*</span>
            </label>
            <Input
              id="startDate"
              type="date"
              {...register('startDate')}
              error={errors.startDate?.message}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              End Date <span className="text-neutral-400">(Optional)</span>
            </label>
            <Input
              id="endDate"
              type="date"
              {...register('endDate')}
              error={errors.endDate?.message}
              disabled={loading}
            />
            <p className="mt-1 text-xs text-neutral-500">
              Leave empty for open-ended assignment
            </p>
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
              disabled={loading || loadingVehicles || vehicles.length === 0}
            >
              Assign Vehicle
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
