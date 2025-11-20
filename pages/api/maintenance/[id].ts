import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateMaintenanceSchema = z.object({
  type: z.enum(['routine', 'repair', 'inspection']).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  cost: z.number().min(0).optional(),
  mileage: z.number().min(0).optional(),
  serviceDate: z.string().optional(),
  servicedBy: z.string().min(1, 'Service provider is required').optional(),
  notes: z.string().optional().nullable(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid maintenance record ID' });
  }

  // GET - Fetch single maintenance record
  if (req.method === 'GET') {
    try {
      const record = await prisma.maintenanceRecord.findUnique({
        where: { id },
        include: {
          vehicle: {
            select: {
              id: true,
              name: true,
              make: true,
              model: true,
              year: true,
              licensePlate: true,
            },
          },
        },
      });

      if (!record) {
        return res.status(404).json({ error: 'Maintenance record not found' });
      }

      return res.status(200).json(record);
    } catch (error) {
      console.error('Error fetching maintenance record:', error);
      return res.status(500).json({ error: 'Failed to fetch maintenance record' });
    }
  }

  // PUT - Update maintenance record
  if (req.method === 'PUT') {
    try {
      const validated = updateMaintenanceSchema.parse(req.body);

      // Check if record exists
      const existingRecord = await prisma.maintenanceRecord.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        return res.status(404).json({ error: 'Maintenance record not found' });
      }

      // Prepare update data
      const updateData: any = {};
      if (validated.type !== undefined) updateData.type = validated.type;
      if (validated.description !== undefined) updateData.description = validated.description;
      if (validated.cost !== undefined) updateData.cost = validated.cost;
      if (validated.mileage !== undefined) updateData.mileage = validated.mileage;
      if (validated.servicedBy !== undefined) updateData.servicedBy = validated.servicedBy;
      if (validated.notes !== undefined) updateData.notes = validated.notes;
      if (validated.serviceDate !== undefined) {
        updateData.serviceDate = new Date(validated.serviceDate);
      }

      const record = await prisma.maintenanceRecord.update({
        where: { id },
        data: updateData,
        include: {
          vehicle: {
            select: {
              id: true,
              name: true,
              make: true,
              model: true,
              year: true,
              licensePlate: true,
            },
          },
        },
      });

      return res.status(200).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid maintenance data',
          details: error.errors,
        });
      }
      console.error('Error updating maintenance record:', error);
      return res.status(500).json({ error: 'Failed to update maintenance record' });
    }
  }

  // DELETE - Remove maintenance record
  if (req.method === 'DELETE') {
    try {
      // Check if record exists
      const existingRecord = await prisma.maintenanceRecord.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        return res.status(404).json({ error: 'Maintenance record not found' });
      }

      // Delete the record
      await prisma.maintenanceRecord.delete({
        where: { id },
      });

      return res.status(200).json({
        message: 'Maintenance record deleted successfully',
        id,
      });
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      return res.status(500).json({ error: 'Failed to delete maintenance record' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
