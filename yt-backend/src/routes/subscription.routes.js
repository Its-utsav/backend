import { Router } from "express";
import {
    getAllSubscribers,
    getAllSubscriptions,
    toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const router = Router();

router.use(verifyUser);

router.route("/c/:channelId").get(getAllSubscribers).post(toggleSubscription);
router.route("/u/:channelId").get(getAllSubscriptions);

export default router;
