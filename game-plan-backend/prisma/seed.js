// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1️⃣ Create super test user
  const coach = await prisma.user.upsert({
    where: { email: "coach@example.com" },
    update: {},
    create: {
      name: "Coach Brandon",
      email: "coach@example.com",
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 2️⃣ Create a team
  const team = await prisma.team.upsert({
    where: { name: "Alpha Team" },
    update: {},
    create: {
      name: "Alpha Team",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 3️⃣ Add coach as HEAD_COACH in TeamMember
  await prisma.teamMember.upsert({
    where: { userId_teamId: { userId: coach.id, teamId: team.id } },
    update: {},
    create: {
      userId: coach.id,
      teamId: team.id,
      role: "HEAD_COACH",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 4️⃣ Create position coach
  const positionCoach = await prisma.user.upsert({
    where: { email: "poscoach@example.com" },
    update: {},
    create: {
      name: "Position Coach",
      email: "poscoach@example.com",
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.teamMember.upsert({
    where: { userId_teamId: { userId: positionCoach.id, teamId: team.id } },
    update: {},
    create: {
      userId: positionCoach.id,
      teamId: team.id,
      role: "POSITION_COACH",
      positionGroup: "OFFENSE",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 5️⃣ Create some players
  const playerEmails = ["player1@example.com", "player2@example.com"];
  for (const email of playerEmails) {
    const player = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: email.split("@")[0],
        email,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.teamMember.upsert({
      where: { userId_teamId: { userId: player.id, teamId: team.id } },
      update: {},
      create: {
        userId: player.id,
        teamId: team.id,
        role: "PLAYER",
        positionGroup: "OFFENSE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
