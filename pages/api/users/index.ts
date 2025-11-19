import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { userSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validated = userSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(validated.password, 10);

      const user = await prisma.user.create({
        data: {
          ...validated,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid user data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
