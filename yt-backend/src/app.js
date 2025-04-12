import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        limit: "16kb",
        extended: true,
    })
);

app.use(express.static("../public"));
app.use(cookieParser());

// imports routes
import userRoutes from "./routes/user.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import videoRoutes from "./routes/video.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import liketRoutes from "./routes/like.routes.js";
import subscriptionsRoutes from "./routes/subscription.routes.js";

// routes decelration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/likes", liketRoutes);
app.use("/api/v1/subscriptions", subscriptionsRoutes);

export default app;
