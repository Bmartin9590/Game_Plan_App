import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// Example: share play with team members
router.post("/:id/share/team", async (req, res) => {
  const { id } = req.params; // play ID
  const { teamId, canEdit } = req.body;
  const userId = req.user.id;

  try {
    // Verify head coach
    const coach = await prisma.teamMember.findFirst({
      where: { teamId: Number(teamId), userId, role: "HEAD_COACH" },
    });
    if (!coach)
      return res.status(403).json({ message: "Only head coaches can share." });

    const members = await prisma.teamMember.findMany({
      where: { teamId: Number(teamId), NOT: { userId } },
    });

    const sharedPlays = await Promise.all(
      members.map((member) =>
        prisma.sharedPlay.upsert({
          where: { playId_sharedWithId: { playId: Number(id), sharedWithId: member.userId } },
          update: { canEdit },
          create: { playId: Number(id), sharedWithId: member.userId, canEdit },
        })
      )
    );

    res.json({ message: "Play shared with team", sharedPlays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sharing play" });
  }
});

export default router;
