import { Router } from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/user.controller.js";

const router = Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/me", getProfile);

export default router;
