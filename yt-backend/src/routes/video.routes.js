import { Router } from "express";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    toggleVideoVisiblity,
    updateVideo,
    uploadVideo,
} from "../controllers/video.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { uploadWithMulter } from "../middlewares/multer.middleware.js";
const router = Router();

router.use(verifyUser);

router
    .route("/")
    .get(getAllVideos)
    .post(
        uploadWithMulter.fields([
            {
                name: "video",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        uploadVideo
    );
router
    .route("/:videoId")
    .get(getVideoById)
    .patch(uploadWithMulter.single("thumbnail"), updateVideo)
    .delete(deleteVideo);

router.route("/toggle/:videoId").patch(toggleVideoVisiblity);

export default router;
