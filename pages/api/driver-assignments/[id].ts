import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateAssignmentSchema = z.object({
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date',
    })
    .optional()
    .nullable(),
  status: z.enum(['active', 'completed']).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid assignment ID' });
  }

  // GET - Fetch single assignment
  if (req.method === 'GET') {
    try {
      const assignment = await prisma.driverAssignment.findUnique({
        where: { id },
        include: {
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              licensePlate: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      return res.status(200).json(assignment);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      return res.status(500).json({ error: 'Failed to fetch assignment' });
    }
  }

  // PUT - Update assignment (complete assignment or change end date)
  if (req.method === 'PUT') {
    try {
      const validated = updateAssignmentSchema.parse(req.body);

      // Check if assignment exists
      const existingAssignment = await prisma.driverAssignment.findUnique({
        where: { id },
      });

      if (!existingAssignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Prepare update data
      const updateData: any = {};
      if (validated.status !== undefined) {
        updateData.status = validated.status;
      }
      if (validated.endDate !== undefined) {
        updateData.endDate = validated.endDate ? new Date(validated.endDate) : null;
      }

      // If completing the assignment, set end date to now if not provided
      if (validated.status === 'completed' && !validated.endDate && !existingAssignment.endDate) {
        updateData.endDate = new Date();
      }

      const assignment = await prisma.driverAssignment.update({
        where: { id },
        data: updateData,
        include: {
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              licensePlate: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid assignment data',
          details: error.errors,
        });
      }
      console.error('Error updating assignment:', error);
      return res.status(500).json({ error: 'Failed to update assignment' });
    }
  }

  // DELETE - Remove assignment
  if (req.method === 'DELETE') {
    try {
      // Check if assignment exists
      const existingAssignment = await prisma.driverAssignment.findUnique({
        where: { id },
      });

      if (!existingAssignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }

      // Delete the assignment
      await prisma.driverAssignment.delete({
        where: { id },
      });

      return res.status(200).json({
        message: 'Assignment deleted successfully',
        id,
      });
    } catch (error) {
      console.error('Error deleting assignment:', error);
      return res.status(500).json({ error: 'Failed to delete assignment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
