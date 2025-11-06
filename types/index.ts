export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: 'active' | 'maintenance' | 'retired';
  fuelType: string;
  mileage: number;
  lastServiceDate?: Date | string | null;
  nextServiceDate?: Date | string | null;
  purchaseDate: Date | string;
  purchasePrice: number;
  imageUrl?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DriverAssignment {
  id: string;
  vehicleId: string;
  userId: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  status: 'active' | 'completed';
  createdAt: Date | string;
  updatedAt: Date | string;
  vehicle?: Vehicle;
  user?: User;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  cost: number;
  mileage: number;
  serviceDate: Date | string;
  servicedBy: string;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  vehicle?: Vehicle;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  startMileage: number;
  endMileage?: number | null;
  startLocation: string;
  endLocation?: string | null;
  purpose: string;
  status: 'in_progress' | 'completed';
  createdAt: Date | string;
  updatedAt: Date | string;
  vehicle?: Vehicle;
}

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  vehiclesInMaintenance: number;
  totalDrivers: number;
  activeTrips: number;
  upcomingMaintenance: number;
  totalMileage: number;
  monthlyMaintenanceCost: number;
}
