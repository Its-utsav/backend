import { Router } from "express";
import {
    createComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import multer from "multer";
const router = Router();
router.use(multer().none());
/**
 * 1. Create Comment
 * 2. get all Comments by user
 * 3. Update or delete Comment
 */

// all the operation can perform by the verfiy user

router.use(verifyUser);

router.route("/:videoid").get(getVideoComments).post(createComment);
router.route("/c/:commentid").patch(updateComment).delete(deleteComment);

export default router;
