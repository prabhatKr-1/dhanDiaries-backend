import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

const app = express();

const port = 3000;

dotenv.config({
  path: "./.env",
});

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
