import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const [
        totalVehicles,
        activeVehicles,
        vehiclesInMaintenance,
        totalDrivers,
        activeTrips,
        upcomingMaintenance,
        vehicles,
        monthlyMaintenance,
      ] = await Promise.all([
        prisma.vehicle.count(),
        prisma.vehicle.count({ where: { status: 'active' } }),
        prisma.vehicle.count({ where: { status: 'maintenance' } }),
        prisma.user.count({ where: { role: { in: ['user', 'manager'] } } }),
        prisma.trip.count({ where: { status: 'in_progress' } }),
        prisma.vehicle.count({
          where: {
            nextServiceDate: {
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.vehicle.findMany({ select: { mileage: true } }),
        prisma.maintenanceRecord.aggregate({
          where: {
            serviceDate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          _sum: { cost: true },
        }),
      ]);

      const totalMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0);

      const stats = {
        totalVehicles,
        activeVehicles,
        vehiclesInMaintenance,
        totalDrivers,
        activeTrips,
        upcomingMaintenance,
        totalMileage,
        monthlyMaintenanceCost: monthlyMaintenance._sum.cost || 0,
      };

      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
