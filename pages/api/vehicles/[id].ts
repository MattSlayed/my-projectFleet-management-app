import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { vehicleSchema } from '@/lib/validations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid vehicle ID' });
  }

  if (req.method === 'GET') {
    try {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id },
        include: {
          assignments: {
            include: { user: true },
          },
          maintenanceRecords: {
            orderBy: { serviceDate: 'desc' },
          },
          trips: {
            orderBy: { startDate: 'desc' },
            take: 10,
          },
        },
      });

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      return res.status(200).json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
  }

  if (req.method === 'PUT') {
    if (session.user.role !== 'admin' && session.user.role !== 'manager') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      const validated = vehicleSchema.partial().parse(req.body);
      const vehicle = await prisma.vehicle.update({
        where: { id },
        data: {
          ...validated,
          purchaseDate: validated.purchaseDate
            ? new Date(validated.purchaseDate)
            : undefined,
          lastServiceDate: validated.lastServiceDate
            ? new Date(validated.lastServiceDate)
            : undefined,
          nextServiceDate: validated.nextServiceDate
            ? new Date(validated.nextServiceDate)
            : undefined,
        },
      });
      return res.status(200).json(vehicle);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid vehicle data' });
    }
  }

  if (req.method === 'DELETE') {
    if (session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    try {
      await prisma.vehicle.delete({ where: { id } });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
