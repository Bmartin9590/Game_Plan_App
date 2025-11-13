import express from "express";
import prisma from "../prismaClient.js";
import { Roles } from "../utils/roles.js";

const router = express.Router();

/**
 * Helper: Share a play with a list of team members
 */
async function sharePlayWithMembers(playId, members, canEdit) {
  return Promise.all(
    members.map((member) =>
      prisma.sharedPlay.upsert({
        where: {
          playId_sharedWithId: {
            playId: Number(playId),
            sharedWithId: member.userId,
          },
        },
        update: { canEdit },
        create: {
          playId: Number(playId),
          sharedWithId: member.userId,
          canEdit,
        },
      })
    )
  );
}

/**
 * Existing sharing routes...
 * HEAD_COACH: /:id/share/team
 * COORDINATOR: /:id/share/side-of-ball
 * POSITION_COACH: /:id/share/position-group
 * (Keep existing code from previous version)
 */

/**
 * NEW: Get users shared with for a specific play
 */
router.get("/:id/shared-users", async (req, res) => {
  const { id } = req.params;
  try {
    const sharedUsers = await prisma.sharedPlay.findMany({
      where: { playId: Number(id) },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    const formatted = sharedUsers.map((s) => ({
      id: s.id,
      name: s.user.name,
      canEdit: s.canEdit,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching shared users:", err);
    res.status(500).json({ message: "Failed to fetch shared users." });
  }
});

/**
 * NEW: Toggle canEdit permission for a shared play
 */
router.patch("/shared/:sharedPlayId/toggle-edit", async (req, res) => {
  const { sharedPlayId } = req.params;

  try {
    const sharedPlay = await prisma.sharedPlay.findUnique({
      where: { id: Number(sharedPlayId) },
    });

    if (!sharedPlay) {
      return res.status(404).json({ message: "Shared play not found." });
    }

    const updated = await prisma.sharedPlay.update({
      where: { id: Number(sharedPlayId) },
      data: { canEdit: !sharedPlay.canEdit },
    });

    res.json(updated);
  } catch (err) {
    console.error("Error toggling canEdit:", err);
    res.status(500).json({ message: "Failed to update shared play." });
  }
});

export default router;
