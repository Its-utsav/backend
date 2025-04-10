import Tweet from "../models/tweet.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
// logged in user
// /
const createTweet = asyncHandler(async (req, res) => {
    const { tweetContent } = req.body;
    if (!tweetContent || tweetContent?.trim() === "") {
        throw new ApiError(400, "Tweet content can not be empty");
    }

    const userId = req.user._id;
    // content , owner

    const createdTweet = await Tweet.create({
        content: tweetContent,
        owner: userId,
    });

    if (!createdTweet) {
        throw new ApiError(500, "Unable to create tweet");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdTweet, "Tweet successfully created"));
});
// /
const getAllTweets = asyncHandler(async (req, res) => {
    const allTweets = await Tweet.find();
    if (!allTweets) {
        throw new ApiError(204, "No tweet found !!! ");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, allTweets, "Tweets fetch successfully"));
});

// user/:id
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(401, "User Id is not provided");
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }

    const userTweets = await Tweet.find({ owner: userId });

    if (!userTweets) {
        throw new ApiError(204, "No tweets found !!! ");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, userTweets, "Tweets fetch successfully"));
});

//tweetId
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(401, "Tweet Id not provided");
    }
    const { tweetContent } = req.body;
    if (!tweetContent || tweetContent?.trim() === "") {
        throw new ApiError(400, "Tweet content can not be empty");
    }

    const oldTweet = await Tweet.findById(tweetId);

    if (!oldTweet) {
        throw new ApiError(404, "Tweets not found");
    }

    if (oldTweet.owner._id.toString() !== req.user._id.toString()) {
        throw new ApiError(
            401,
            "Unauthorized , You can not update other tweets"
        );
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: tweetContent,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedTweet) {
        throw new ApiError(500, "Something went wrong while updating tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet updated successully"));
});

//tweetId
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(401, "Tweet Id not provided");
    }
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweets not found");
    }

    if (tweet.owner._id.toString() !== req.user._id.toString()) {
        throw new ApiError(
            401,
            "Unauthorized , You can not delete other tweet"
        );
    }

    return res
        .status(204)
        .json(new ApiResponse(200, "Tweet deleted successfuly"));
});

export { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet };
