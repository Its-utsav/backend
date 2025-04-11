import { Router } from "express";
import {
    getUserPlaylist,
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    deleteVideoToPlaylist,
    getPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const router = Router();

// eg playlist id 67f920cd54351d07213e3a26

router.use(verifyUser);

router.route("/").post(createPlaylist);
router.route("/:userId").get(getUserPlaylist);
router
    .route("/:playlistId")
    .get(getPlaylist)
    .patch(updatePlaylist)
    .delete(deletePlaylist);
router
    .route("/:videoId/:playlistId")
    .delete(deleteVideoToPlaylist)
    .patch(addVideoToPlaylist);

export default router;
