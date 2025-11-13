import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

// 🔑 Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "supersecretkey",
    { expiresIn: "7d" }
  );
};

// 🧩 POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: role || "COACH" },
    });

    const token = generateToken(newUser);
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// 🧩 POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Verify token and return user info
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // 🧩 Check for missing header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No or invalid Authorization header");
      return res.status(401).json({ message: "No token provided" });
    }

    // 🧩 Extract the token and show debug logs
    const token = authHeader.split(" ")[1];
    console.log("🔑 Token received (first 25 chars):", token.slice(0, 25));
    console.log("🧩 JWT_SECRET used (first 10 chars):", process.env.JWT_SECRET?.slice(0, 10));

    // 🧩 Verify token with secret
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🧩 Look up user in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        teamMembers: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!user) {
      console.log("❌ No user found for decoded token:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Success
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.teamMembers.map((tm) => tm.role),
      teams: user.teamMembers.map((tm) => tm.team),
    });
  } catch (error) {
    console.error("🔥 /me endpoint error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
