import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { tripSchema } from '@/lib/validations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { vehicleId, driverId, status } = req.query;
      const where: any = {};

      if (vehicleId) where.vehicleId = vehicleId;
      if (driverId) where.driverId = driverId;
      if (status) where.status = status;

      const trips = await prisma.trip.findMany({
        where,
        orderBy: { startDate: 'desc' },
        include: { vehicle: true },
      });
      return res.status(200).json(trips);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch trips' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validated = tripSchema.parse(req.body);
      const trip = await prisma.trip.create({
        data: {
          ...validated,
          startDate: new Date(validated.startDate),
          endDate: validated.endDate ? new Date(validated.endDate) : null,
        },
      });
      return res.status(201).json(trip);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid trip data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
