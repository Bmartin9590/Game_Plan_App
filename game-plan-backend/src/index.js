// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prismaClient.js";
import authRoutes from "./routes/authRoutes.js";
import playRoutes from "./routes/playRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/plays", playRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("Prisma connect error:", err);
  }
});
