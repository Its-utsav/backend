import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { uploadWithMulter } from "../middlewares/multer.middleware.js";

const router = Router();

// /api/v1/ prefix

// /api/v1/register
router.route("/register").post(
    uploadWithMulter.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);

// /api/v1/login
router.route("/login").post(loginUser);

export default router;
