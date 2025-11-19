import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { vehicleSchema } from '@/lib/validations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          assignments: {
            where: { status: 'active' },
            include: { user: true },
          },
        },
      });
      return res.status(200).json(vehicles);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validated = vehicleSchema.parse(req.body);
      const vehicle = await prisma.vehicle.create({
        data: {
          ...validated,
          purchaseDate: new Date(validated.purchaseDate),
          lastServiceDate: validated.lastServiceDate
            ? new Date(validated.lastServiceDate)
            : null,
          nextServiceDate: validated.nextServiceDate
            ? new Date(validated.nextServiceDate)
            : null,
        },
      });
      return res.status(201).json(vehicle);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid vehicle data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
