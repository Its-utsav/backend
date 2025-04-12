import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {
    getLikedVideos,
    toggleLikeOnComment,
    toggleLikeOnTweet,
    toggleLikeOnVideo,
} from "../controllers/like.controller.js";
const router = Router();
// can be on tweet , comment and youtube video
// only done by loggedin user
//
// like -> dislike
// dislike -> like

router.use(verifyUser);

router.route("/toggle/v/:videoId").post(toggleLikeOnVideo);
router.route("/toggle/t/:tweetId").post(toggleLikeOnTweet);
router.route("/toggle/c/:commentId").post(toggleLikeOnComment);
router.route("/videos").get(getLikedVideos);

export default router;
