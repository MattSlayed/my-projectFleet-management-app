import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { maintenanceSchema } from '@/lib/validations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { vehicleId } = req.query;
      const where = vehicleId ? { vehicleId: vehicleId as string } : {};

      const records = await prisma.maintenanceRecord.findMany({
        where,
        orderBy: { serviceDate: 'desc' },
        include: { vehicle: true },
      });
      return res.status(200).json(records);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch maintenance records' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validated = maintenanceSchema.parse(req.body);
      const record = await prisma.maintenanceRecord.create({
        data: {
          ...validated,
          serviceDate: new Date(validated.serviceDate),
        },
      });
      return res.status(201).json(record);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid maintenance data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
