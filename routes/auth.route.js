import { Router } from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../utils/auth.middleware.js";

const router = Router();
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", verifyJWT, getProfile);
router.post("/logout", verifyJWT, logoutUser);

export default router;
