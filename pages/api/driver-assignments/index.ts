import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createAssignmentSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid end date',
    })
    .optional()
    .nullable(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET - List all assignments (with optional filters)
  if (req.method === 'GET') {
    try {
      const { userId, vehicleId, status } = req.query;

      const where: any = {};
      if (userId && typeof userId === 'string') {
        where.userId = userId;
      }
      if (vehicleId && typeof vehicleId === 'string') {
        where.vehicleId = vehicleId;
      }
      if (status && typeof status === 'string') {
        where.status = status;
      }

      const assignments = await prisma.driverAssignment.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return res.status(500).json({ error: 'Failed to fetch assignments' });
    }
  }

  // POST - Create new assignment
  if (req.method === 'POST') {
    try {
      const validated = createAssignmentSchema.parse(req.body);

      // Check if vehicle exists and is available
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: validated.vehicleId },
      });

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      if (vehicle.status !== 'active') {
        return res.status(400).json({
          error: 'Vehicle is not available',
          details: `Vehicle status: ${vehicle.status}`,
        });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: validated.userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check for existing active assignment for this vehicle
      const existingAssignment = await prisma.driverAssignment.findFirst({
        where: {
          vehicleId: validated.vehicleId,
          status: 'active',
        },
      });

      if (existingAssignment) {
        return res.status(400).json({
          error: 'Vehicle is already assigned',
          details: 'Complete or end the existing assignment first',
        });
      }

      // Create the assignment
      const assignment = await prisma.driverAssignment.create({
        data: {
          vehicleId: validated.vehicleId,
          userId: validated.userId,
          startDate: new Date(validated.startDate),
          endDate: validated.endDate ? new Date(validated.endDate) : null,
          status: 'active',
        },
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

      return res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid assignment data',
          details: error.errors,
        });
      }
      console.error('Error creating assignment:', error);
      return res.status(500).json({ error: 'Failed to create assignment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
