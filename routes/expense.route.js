import { Router } from "express";
import {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpense,
} from "../controllers/expense.controller.js";
import { verifyJWT } from "../utils/auth.middleware.js";

const router = Router();

router.get("/all", verifyJWT, getExpense);
router.post("/add", verifyJWT, createExpense);
router.delete("/:id", verifyJWT, deleteExpense);
router.put("/:id", verifyJWT, updateExpense);

export default router;
