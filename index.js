import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"

const app = express();

const port = 3000;

dotenv.config({
  path: "./.env",
});

connectDB();

app.use("/api/v1/auth",authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
