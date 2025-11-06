const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fleet.com' },
    update: {},
    create: {
      email: 'admin@fleet.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 10);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@fleet.com' },
    update: {},
    create: {
      email: 'manager@fleet.com',
      name: 'Fleet Manager',
      password: managerPassword,
      role: 'manager',
    },
  });

  console.log('Created manager user:', manager.email);

  // Create regular users/drivers
  const driverPassword = await bcrypt.hash('driver123', 10);

  const driver1 = await prisma.user.upsert({
    where: { email: 'john.doe@fleet.com' },
    update: {},
    create: {
      email: 'john.doe@fleet.com',
      name: 'John Doe',
      password: driverPassword,
      role: 'user',
    },
  });

  const driver2 = await prisma.user.upsert({
    where: { email: 'jane.smith@fleet.com' },
    update: {},
    create: {
      email: 'jane.smith@fleet.com',
      name: 'Jane Smith',
      password: driverPassword,
      role: 'user',
    },
  });

  console.log('Created driver users');

  // Create vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      name: 'Delivery Van 1',
      make: 'Ford',
      model: 'Transit',
      year: 2022,
      licensePlate: 'ABC-1234',
      vin: '1FTYR10D67PA12345',
      status: 'active',
      fuelType: 'Diesel',
      mileage: 25000,
      purchaseDate: new Date('2022-01-15'),
      purchasePrice: 35000,
      lastServiceDate: new Date('2024-10-01'),
      nextServiceDate: new Date('2025-01-01'),
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      name: 'Pickup Truck 1',
      make: 'Toyota',
      model: 'Tacoma',
      year: 2023,
      licensePlate: 'XYZ-5678',
      vin: '3TMCZ5AN1NM123456',
      status: 'active',
      fuelType: 'Gasoline',
      mileage: 15000,
      purchaseDate: new Date('2023-03-20'),
      purchasePrice: 42000,
      lastServiceDate: new Date('2024-09-15'),
      nextServiceDate: new Date('2024-12-15'),
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      name: 'Cargo Van 2',
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2021,
      licensePlate: 'DEF-9012',
      vin: 'WD5PE8CB2LK123456',
      status: 'maintenance',
      fuelType: 'Diesel',
      mileage: 45000,
      purchaseDate: new Date('2021-06-10'),
      purchasePrice: 48000,
      lastServiceDate: new Date('2024-11-01'),
      nextServiceDate: new Date('2024-11-20'),
    },
  });

  console.log('Created vehicles');

  // Create maintenance records
  await prisma.maintenanceRecord.create({
    data: {
      vehicleId: vehicle1.id,
      type: 'routine',
      description: 'Oil change and filter replacement',
      cost: 150,
      mileage: 24500,
      serviceDate: new Date('2024-10-01'),
      servicedBy: 'Quick Lube Auto Service',
      notes: 'All fluids topped up',
    },
  });

  await prisma.maintenanceRecord.create({
    data: {
      vehicleId: vehicle2.id,
      type: 'inspection',
      description: 'Annual safety inspection',
      cost: 75,
      mileage: 14800,
      serviceDate: new Date('2024-09-15'),
      servicedBy: 'State Inspection Center',
      notes: 'Passed all safety checks',
    },
  });

  await prisma.maintenanceRecord.create({
    data: {
      vehicleId: vehicle3.id,
      type: 'repair',
      description: 'Brake pad replacement',
      cost: 450,
      mileage: 44500,
      serviceDate: new Date('2024-11-01'),
      servicedBy: 'Premium Auto Repair',
      notes: 'Front and rear brake pads replaced',
    },
  });

  console.log('Created maintenance records');

  // Create driver assignments
  await prisma.driverAssignment.create({
    data: {
      vehicleId: vehicle1.id,
      userId: driver1.id,
      startDate: new Date('2024-01-01'),
      status: 'active',
    },
  });

  await prisma.driverAssignment.create({
    data: {
      vehicleId: vehicle2.id,
      userId: driver2.id,
      startDate: new Date('2024-02-01'),
      status: 'active',
    },
  });

  console.log('Created driver assignments');

  // Create trips
  await prisma.trip.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: driver1.id,
      startDate: new Date('2024-11-01T08:00:00'),
      endDate: new Date('2024-11-01T17:00:00'),
      startMileage: 24800,
      endMileage: 25000,
      startLocation: 'Warehouse A',
      endLocation: 'Warehouse A',
      purpose: 'Delivery Route 1',
      status: 'completed',
    },
  });

  await prisma.trip.create({
    data: {
      vehicleId: vehicle2.id,
      driverId: driver2.id,
      startDate: new Date('2024-11-05T09:00:00'),
      startMileage: 15000,
      startLocation: 'Main Office',
      purpose: 'Equipment Transport',
      status: 'in_progress',
    },
  });

  console.log('Created trips');

  console.log('Database seeding completed successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin - Email: admin@fleet.com, Password: admin123');
  console.log('Manager - Email: manager@fleet.com, Password: manager123');
  console.log('Driver - Email: john.doe@fleet.com, Password: driver123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
