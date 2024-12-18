import express, { urlencoded } from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import expenseRoutes from "./routes/expense.route.js";
import { errorMiddleware } from "./utils/ApiError.js";
import cookieParser from "cookie-parser";

const app = express();

const port = 3000;

dotenv.config({
  path: "./.env",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expense", expenseRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use(errorMiddleware);
