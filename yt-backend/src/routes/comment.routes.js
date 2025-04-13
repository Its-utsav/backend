import { Router } from "express";
import {
    createComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { formData } from "../middlewares/multer.middleware.js";
const router = Router();
/**
 * 1. Create Comment
 * 2. get all Comments by user
 * 3. Update or delete Comment
 */

// all the operation can perform by the verfiy user

router.use(verifyUser, formData);

router.route("/:videoId").get(getVideoComments).post(createComment);
router.route("/c/:commentId").patch(updateComment).delete(deleteComment);

export default router;
