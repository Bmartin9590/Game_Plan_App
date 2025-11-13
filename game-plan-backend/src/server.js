// src/server.js
import express from "express";
import shareRoutes from "./routes/shareRoutes.js";
import prisma from "./prismaClient.js";
import playRoutes from "./routes/playRoutes.js";

app.use("/api/plays", playRoutes);

const app = express();
app.use(express.json());

// Example auth middleware (replace with real JWT middleware)
app.use((req, res, next) => {
  // Mock user - in real app, decode from token
  req.user = { id: 1 }; 
  next();
});

// Routes
app.use("/api/plays", shareRoutes);

// Default server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;

