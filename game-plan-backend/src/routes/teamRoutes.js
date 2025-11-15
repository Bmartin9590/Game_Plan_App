import express from 'express';
import prisma from '../prismaClient.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🏈 Create a team
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const team = await prisma.team.create({
      data: {
        name,
        members: {
          create: {
            userId: req.user.id,
            role: 'Head Coach'
          }
        }
      },
      include: { members: true }
    });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: 'Error creating team' });
  }
});

// 📋 Get teams for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      where: {
        members: { some: { userId: req.user.id } }
      },
      include: { members: true }
    });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching teams' });
  }
});

export default router;
