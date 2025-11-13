// src/routes/playRoutes.js
import express from "express";
import prisma from "../prismaClient.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Helpers */
const Roles = {
  HEAD_COACH: "HEAD_COACH",
  COORDINATOR: "COORDINATOR",
  POSITION_COACH: "POSITION_COACH",
  PLAYER: "PLAYER",
  COACH: "COACH",
};

/* Create a play - authenticated */
router.post("/", authenticate, async (req, res) => {
  try {
    const { name, players, routes, teamId } = req.body;
    const created = await prisma.play.create({
      data: { name, players, routes, teamId: teamId ? Number(teamId) : null, createdById: req.user.id }
    });
    res.json(created);
  } catch (err) {
    console.error("Create play error:", err);
    res.status(500).json({ message: "Failed to create play" });
  }
});

/* Get plays accessible to user (created by or shared with) */
router.get("/", authenticate, async (req, res) => {
  try {
    const plays = await prisma.play.findMany({
      where: {
        OR: [
          { createdById: req.user.id },
          { sharedPlays: { some: { sharedWithId: req.user.id } } }
        ]
      },
      include: { sharedPlays: true }
    });
    res.json(plays);
  } catch (err) {
    console.error("Get plays error:", err);
    res.status(500).json({ message: "Failed to fetch plays" });
  }
});

/* Get single play */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const play = await prisma.play.findUnique({ where: { id: Number(req.params.id) } });
    if (!play) return res.status(404).json({ message: "Play not found" });
    res.json(play);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch play" });
  }
});

/* Update play - only creator or someone with canEdit */
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { name, players, routes } = req.body;
    const play = await prisma.play.findUnique({ where: { id: Number(req.params.id) }, include: { sharedPlays: true }});
    if (!play) return res.status(404).json({ message: "Play not found" });

    // Allow if creator
    if (play.createdById === req.user.id) {
      const updated = await prisma.play.update({ where: { id: play.id }, data: { name, players, routes } });
      return res.json(updated);
    }

    // Check sharedPlay permission
    const sharedEntry = await prisma.sharedPlay.findFirst({
      where: { playId: play.id, sharedWithId: req.user.id }
    });
    if (!sharedEntry || !sharedEntry.canEdit) return res.status(403).json({ message: "No permission to edit" });

    const updated = await prisma.play.update({ where: { id: play.id }, data: { name, players, routes } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update play" });
  }
});

/* ===========================
   SHARING ENDPOINTS (RBAC)
   =========================== */

/* Head coach - share with whole team */
router.post("/:id/share/team", authenticate, async (req, res) => {
  try {
    const playId = Number(req.params.id);
    const { teamId, canEdit = false } = req.body;
    const userId = req.user.id;

    // Check that the user is head coach on that team
    const tm = await prisma.teamMember.findFirst({
      where: { teamId: Number(teamId), userId, role: Roles.HEAD_COACH }
    });
    if (!tm) return res.status(403).json({ message: "Only head coaches can share to the whole team." });

    const members = await prisma.teamMember.findMany({
      where: { teamId: Number(teamId), NOT: { userId } }
    });

    const results = await Promise.all(members.map(m =>
      prisma.sharedPlay.upsert({
        where: { playId_sharedWithId: { playId, sharedWithId: m.userId } },
        update: { canEdit },
        create: { playId, sharedWithId: m.userId, canEdit }
      })
    ));

    res.json({ message: "Shared with team", shared: results });
  } catch (err) {
    console.error("share team error:", err);
    res.status(500).json({ message: "Failed to share with team" });
  }
});

/* Position coach - share with their position group */
router.post("/:id/share/position-group", authenticate, async (req, res) => {
  try {
    const playId = Number(req.params.id);
    const { teamId, canEdit = false } = req.body;
    const userId = req.user.id;

    const coachMember = await prisma.teamMember.findFirst({
      where: { teamId: Number(teamId), userId, role: Roles.POSITION_COACH }
    });
    if (!coachMember || !coachMember.positionGroup) {
      return res.status(403).json({ message: "Only position coaches with a position group can share to that group." });
    }

    const groupMembers = await prisma.teamMember.findMany({
      where: {
        teamId: Number(teamId),
        positionGroup: coachMember.positionGroup,
        NOT: { userId },
        role: { in: ["PLAYER", "COORDINATOR", "POSITION_COACH"] }
      }
    });

    const results = await Promise.all(groupMembers.map(m =>
      prisma.sharedPlay.upsert({
        where: { playId_sharedWithId: { playId, sharedWithId: m.userId } },
        update: { canEdit },
        create: { playId, sharedWithId: m.userId, canEdit }
      })
    ));

    res.json({ message: `Shared with ${coachMember.positionGroup}`, shared: results });
  } catch (err) {
    console.error("share position-group error:", err);
    res.status(500).json({ message: "Failed to share with position group" });
  }
});

/* Coordinator - share with side of ball (OFFENSE or DEFENSE) */
router.post("/:id/share/side-of-ball", authenticate, async (req, res) => {
  try {
    const playId = Number(req.params.id);
    const { teamId, side = "OFFENSE", canEdit = false } = req.body;
    const userId = req.user.id;

    // check coordinator role for that team
    const coord = await prisma.teamMember.findFirst({
      where: { teamId: Number(teamId), userId, role: Roles.COORDINATOR }
    });
    if (!coord) return res.status(403).json({ message: "Only coordinators can share to side-of-ball." });

    const members = await prisma.teamMember.findMany({
      where: { teamId: Number(teamId), sideOfBall: side, NOT: { userId } }
    });

    const results = await Promise.all(members.map(m =>
      prisma.sharedPlay.upsert({
        where: { playId_sharedWithId: { playId, sharedWithId: m.userId } },
        update: { canEdit },
        create: { playId, sharedWithId: m.userId, canEdit }
      })
    ));
    res.json({ message: `Shared with ${side}`, shared: results });
  } catch (err) {
    console.error("share side error:", err);
    res.status(500).json({ message: "Failed to share with side-of-ball" });
  }
});

/* Get shared users for a play (for modal) */
router.get("/:id/shared-users", authenticate, async (req, res) => {
  try {
    const playId = Number(req.params.id);
    const list = await prisma.sharedPlay.findMany({
      where: { playId },
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    const formatted = list.map(s => ({ id: s.id, userId: s.sharedWithId, name: s.user?.name || "Unknown", canEdit: s.canEdit }));
    res.json(formatted);
  } catch (err) {
    console.error("shared-users error:", err);
    res.status(500).json({ message: "Failed to fetch shared users" });
  }
});

/* Toggle canEdit */
router.patch("/shared/:sharedPlayId/toggle-edit", authenticate, async (req, res) => {
  try {
    const spId = Number(req.params.sharedPlayId);
    const sp = await prisma.sharedPlay.findUnique({ where: { id: spId } });
    if (!sp) return res.status(404).json({ message: "Shared play not found" });

    // Only creator or head coach of play's team (or the shared play owner) could change — keep it simple: allow only creator
    const play = await prisma.play.findUnique({ where: { id: sp.playId } });
    if (!play) return res.status(404).json({ message: "Play not found" });
    if (play.createdById !== req.user.id) return res.status(403).json({ message: "Not allowed" });

    const updated = await prisma.sharedPlay.update({ where: { id: spId }, data: { canEdit: !sp.canEdit } });
    res.json(updated);
  } catch (err) {
    console.error("toggle-edit error:", err);
    res.status(500).json({ message: "Failed to toggle canEdit" });
  }
});

export default router;
