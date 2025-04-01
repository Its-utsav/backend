import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
const router = Router();

// /api/v1/ prefix

// /api/v1/register
router.route("/register").post(registerUser);

// /api/v1/login
router.route("/login").post(loginUser);

export default router;
