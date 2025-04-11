import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    getAllTweets,
    getTweetByTweetId,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * 1. Create tweet
 * 2. get all tweets by user
 * 3. Update or delete tweet
 */

// all the operation can perform by the verfiy user

router.use(verifyUser);

router.route("/").post(createTweet).get(getAllTweets);
router.route("/user/:userId").get(getUserTweets);
router
    .route("/:tweetId")
    .get(getTweetByTweetId)
    .patch(updateTweet)
    .delete(deleteTweet);

export default router;
