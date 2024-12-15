import { Router } from "express";
import loginUser from "../controllers/login.controller.js";
import registerUser from "../controllers/register.controller.js";

const router = Router();
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;