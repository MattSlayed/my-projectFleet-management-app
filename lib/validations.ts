import { z } from 'zod';

export const vehicleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1, 'License plate is required'),
  vin: z.string().min(17, 'VIN must be at least 17 characters').max(17),
  status: z.enum(['active', 'maintenance', 'retired']),
  fuelType: z.string().min(1, 'Fuel type is required'),
  mileage: z.number().min(0),
  lastServiceDate: z.string().optional(),
  nextServiceDate: z.string().optional(),
  purchaseDate: z.string(),
  purchasePrice: z.number().min(0),
  imageUrl: z.string().optional(),
});

export const maintenanceSchema = z.object({
  vehicleId: z.string(),
  type: z.enum(['routine', 'repair', 'inspection']),
  description: z.string().min(1, 'Description is required'),
  cost: z.number().min(0),
  mileage: z.number().min(0),
  serviceDate: z.string(),
  servicedBy: z.string().min(1, 'Service provider is required'),
  notes: z.string().optional(),
});

export const tripSchema = z.object({
  vehicleId: z.string(),
  driverId: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  startMileage: z.number().min(0),
  endMileage: z.number().min(0).optional(),
  startLocation: z.string().min(1, 'Start location is required'),
  endLocation: z.string().optional(),
  purpose: z.string().min(1, 'Purpose is required'),
  status: z.enum(['in_progress', 'completed']),
});

export const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'manager', 'user']),
});

export const driverAssignmentSchema = z.object({
  vehicleId: z.string(),
  userId: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  status: z.enum(['active', 'completed']),
});
