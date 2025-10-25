import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import walletRoutes from "./routes/wallets.js";
import categoryRoutes from "./routes/categories.js";
import transactionRoutes from "./routes/transactions.js";
import budgetRoutes from "./routes/budgets.js";
import settingRoutes from "./routes/settings.js"
import { errorHandler } from "./middleware/errorHandler.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/settings", settingRoutes);
app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT} 🚀`);
});
