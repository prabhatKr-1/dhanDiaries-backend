import { Router } from "express";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpense,
} from "../controllers/expense.controller.js";

const router = Router();

router.get("/all", getExpense);
router.post("/add", createExpense);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);

export default router;
