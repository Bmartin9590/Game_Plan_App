import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// TEMP auth middleware for testing
app.use((req, res, next) => {
  req.user = { id: 1 }; // replace with JWT middleware later
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plays", shareRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
