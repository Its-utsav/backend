import Like from "../models/likes.model.js";
import Video from "../models/video.model.js";
import Tweet from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import Comment from "../models/comments.model.js";

// /toggle/:videoId
const toggleLikeOnVideo = asyncHandler(async (req, res) => {
    // like -> dislike
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Video Id not provided");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "No video found with given video Id");
    }
    const isLiked = await Like.findOne({
        likeBy: req.user._id,
        video: videoId,
    });

    // no like
    let msg = "";
    if (!isLiked) {
        await Like.create({
            likeBy: req.user._id,
            video: videoId,
        });
        msg = "Liked added";
    } else {
        // like che
        await Like.deleteOne({
            likeBy: req.user._id,
            video: videoId,
        });
        msg = "Liked removed";
    }
    const totalLike = await Like.countDocuments({ video: videoId });

    return res
        .status(200)
        .json(new ApiResponse(200, { totalLike, isLiked: !isLiked }, msg));
});
// /toggle/:tweetId
const toggleLikeOnTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id not provided");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(400, "No tweet found with given tweet Id");
    }
    const isLiked = await Like.findOne({
        likeBy: req.user._id,
        tweet: tweetId,
    });

    // no like
    let msg = "";
    if (!isLiked) {
        await Like.create({
            likeBy: req.user._id,
            tweet: tweetId,
        });
        msg = "Liked added";
    } else {
        // like che
        await Like.deleteOne({
            likeBy: req.user._id,
            tweet: tweetId,
        });
        msg = "Liked removed";
    }
    const totalLike = await Like.countDocuments({ tweet: tweetId });

    return res
        .status(200)
        .json(new ApiResponse(200, { totalLike, isLiked: !isLiked }, msg));
});
// /toggle/:commentId
const toggleLikeOnComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "comment Id not provided");
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(400, "No comment found with given comment Id");
    }
    const isLiked = await Like.findOne({
        likeBy: req.user._id,
        comment: commentId,
    });

    // no like
    let msg = "";
    if (!isLiked) {
        await Like.create({
            likeBy: req.user._id,
            comment: commentId,
        });
        msg = "Liked added";
    } else {
        // like che
        await Like.deleteOne({
            likeBy: req.user._id,
            comment: commentId,
        });
        msg = "Liked removed";
    }
    const totalLike = await Like.countDocuments({ comment: commentId });

    return res
        .status(200)
        .json(new ApiResponse(200, { totalLike, isLiked: !isLiked }, msg));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const videos = await Like.aggregate([
        {
            $match: {
                likeBy: req.user._id,
                video: { $ne: null },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoData",
            },
        },
        {
            $unwind: "$videoData",
        },
        {
            $replaceRoot: {
                newRoot: "$videoData",
            },
        },
    ]);

    if (!videos || videos.length == 0) {
        throw new ApiError(404, "No liked video found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Fetch all Liked videos "));
});

export {
    toggleLikeOnComment,
    toggleLikeOnTweet,
    toggleLikeOnVideo,
    getLikedVideos,
};
