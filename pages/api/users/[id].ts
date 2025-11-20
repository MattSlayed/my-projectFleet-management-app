import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['admin', 'manager', 'user']).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // GET - Fetch single user with relations
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          driverAssignments: {
            include: {
              vehicle: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          trips: {
            include: {
              vehicle: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  // PUT - Update user
  if (req.method === 'PUT') {
    try {
      const validated = updateUserSchema.parse(req.body);

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Prepare update data
      const updateData: any = {};
      if (validated.name !== undefined) updateData.name = validated.name;
      if (validated.email !== undefined) updateData.email = validated.email;
      if (validated.role !== undefined) updateData.role = validated.role;

      // Hash password if provided
      if (validated.password) {
        updateData.password = await bcrypt.hash(validated.password, 10);
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid user data', details: error.errors });
      }
      return res.status(400).json({ error: 'Failed to update user' });
    }
  }

  // DELETE - Soft delete user
  if (req.method === 'DELETE') {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
        include: {
          driverAssignments: {
            where: { status: 'active' },
          },
          trips: {
            where: { status: 'in_progress' },
          },
        },
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check for active assignments or trips
      if (existingUser.driverAssignments.length > 0) {
        return res.status(400).json({
          error: 'Cannot delete user with active vehicle assignments',
          details: 'Please complete or reassign active assignments first'
        });
      }

      if (existingUser.trips.length > 0) {
        return res.status(400).json({
          error: 'Cannot delete user with active trips',
          details: 'Please complete active trips first'
        });
      }

      // Delete the user
      await prisma.user.delete({
        where: { id },
      });

      return res.status(200).json({
        message: 'User deleted successfully',
        id
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
