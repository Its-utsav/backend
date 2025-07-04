import { Router } from "express";
import {
    avatarUpdate,
    changePassword,
    coverImageUpdate,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateFullNameAndEmail,
    deleteUser,
} from "../controllers/user.controller.js";
import {
    formData,
    uploadWithMulter,
} from "../middlewares/multer.middleware.js";
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
router.route("/login").post(formData, loginUser);

router.route("/logout").post(verifyUser, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/passwordChange").post(verifyUser, formData, changePassword);
router.route("/currentUser").get(verifyUser, getCurrentUser);
router
    .route("/updateDetails")
    .patch(verifyUser, formData, updateFullNameAndEmail);
router
    .route("/updateAvatar")
    .patch(verifyUser, uploadWithMulter.single("avatar"), avatarUpdate);
router
    .route("/updateCoverImage")
    .patch(verifyUser, uploadWithMulter.single("coverImage"), coverImageUpdate);

router.route("/c/:username").get(verifyUser, getUserChannelProfile);
router.route("/watchHistory").get(verifyUser, getWatchHistory);
router.route("/delete").get(verifyUser, deleteUser);

export default router;
