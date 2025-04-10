import Comment from "../models/comments.model.js";
import Video from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// user is already verify
// req.user?.id

// videoId

const createComment = asyncHandler(async (req, res) => {
    const { videoid } = req.params;
    if (!videoid) {
        throw new ApiError(400, "Video not found");
    }

    const { commentContent } = req.body;
    if (!commentContent || commentContent?.trim() === "") {
        throw new ApiError(400, "Comment Can not be empty");
    }
    const video = await Video.findById(videoid);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    // content , videoid , user
    const videoComment = await Comment.create({
        content: commentContent,
        video: videoid,
        owner: req.user._id,
    });

    if (!videoComment) {
        throw new ApiError(500, "Something worng while commenting");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, videoComment, "Comment added successfuly"));
});

// videoId
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoid } = req.params;
    if (!videoid) {
        throw new ApiError(400, "Video not found");
    }

    const video = await Video.findById(videoid);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    // find comment
    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoid),
            },
        },
    ]);
    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

//commentid
const updateComment = asyncHandler(async (req, res) => {
    const { commentid } = req.params;
    if (!commentid) {
        throw new ApiError(400, "Invalid comment id");
    }
    const { commentContent } = req.body;
    if (!commentContent || commentContent?.trim() === "") {
        throw new ApiError(400, "Comment Can not be empty");
    }
    const oldComment = await Comment.findById(commentid);

    if (!oldComment) {
        throw new ApiError(404, "Comment not found");
    }
    // check user id with comment id

    if (req.user._id.toString() != oldComment.owner._id.toString()) {
        throw new ApiError(403, "You can only update your comment only");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        oldComment._id,
        {
            $set: {
                content: commentContent,
            },
        },
        {
            new: true,
        }
    );
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedComment, "Comment updated successfully")
        );
});

//commentid
const deleteComment = asyncHandler(async (req, res) => {
    const { commentid } = req.params;
    if (!commentid) {
        throw new ApiError(400, "Invalid comment id");
    }

    const comment = await Comment.findById(commentid);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (req.user._id.toString() != comment.owner._id.toString()) {
        throw new ApiError(403, "You can only delete your comment only");
    }

    await comment.deleteOne();

    return res
        .status(204)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { createComment, deleteComment, getVideoComments, updateComment };
