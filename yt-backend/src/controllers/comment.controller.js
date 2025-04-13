import mongoose, { isValidObjectId } from "mongoose";
import Comment from "../models/comments.model.js";
import Video from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// user is already verify
// req.user?.id

// videoId

const createComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(
            400,
            "Video Id is not provided or Video Id is invalid"
        );
    }

    const { commentContent } = req.body;
    if (!commentContent || commentContent?.trim() === "") {
        throw new ApiError(400, "Comment Can not be empty");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    // content , videoId , user
    const videoComment = await Comment.create({
        content: commentContent,
        video: videoId,
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
    const { videoId } = req.params;
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(
            400,
            "Video Id is not provided or Video Id is invalid"
        );
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    // find comment
    const { page = 1, limit = 10 } = req.params;

    const pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "owner",
                as: "commentBy",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                commentBy: {
                    $first: "$commentBy",
                },
            },
        },
    ];
    const comments = await Comment.aggregatePaginate(
        Comment.aggregate(pipeline),
        {
            limit: parseInt(limit),
            page: parseInt(page),
        }
    );
    if (comments.length === 0) {
        throw new ApiError(400, "No Comments found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

//commentId
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(
            400,
            "Invalid comment Id or comment Id is not provided"
        );
    }
    const { commentContent } = req.body;
    if (
        !commentContent ||
        commentContent?.trim() === "" ||
        commentContent === undefined
    ) {
        throw new ApiError(400, "Comment Can not be empty");
    }
    const oldComment = await Comment.findById(commentId);

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

//commentId
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(
            400,
            "Invalid comment Id or comment Id is not provided"
        );
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (req.user._id.toString() != comment.owner._id.toString()) {
        throw new ApiError(403, "You can only delete your comment only");
    }

    await comment.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { createComment, deleteComment, getVideoComments, updateComment };
