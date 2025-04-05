import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controllers/user.controller.js";
import { uploadWithMulter } from "../middlewares/multer.middleware.js";
import { checkExistingUser } from "../middlewares/user.middleware.js";

import multer from "multer";
import { verifyUser } from "../middlewares/auth.middleware.js";
const router = Router();

// /api/v1/ prefix

// /api/v1/register
router.route("/register").post(
    uploadWithMulter.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    checkExistingUser,
    registerUser
);

// /api/v1/login
const upload = multer().none();
router.route("/login").post(upload, loginUser);

router.route("/logout").post(verifyUser, logoutUser);
router.route("/refreshToken").post(refreshAccessToken)

export default router;
