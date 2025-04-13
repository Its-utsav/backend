import mongoose, { isValidObjectId } from "mongoose";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    // -> subscribed -> unsubscribe
    const { channelId } = req.params;
    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is not provided or invalid");
    }

    if (channelId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You can not subscribe your channel :)");
    }
    const channel = await User.findById({ _id: channelId });

    if (!channel) {
        throw new ApiError(400, "Channel is not found with given channel Id");
    }

    const isSubscribed = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id,
    });
    let msg = "";

    if (isSubscribed) {
        await Subscription.deleteOne({
            channel: channelId,
            subscriber: req.user._id,
        });
        msg = "Channel unsubscribed";
    } else {
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId,
        });
        msg = "Channel subscribed";
    }

    const subscriberCount = await Subscription.countDocuments({
        channel: channelId,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { subscriberCount, isSubscribed: !isSubscribed },
                msg
            )
        );
});

//channelId
const getAllSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is not provided or invalid");
    }

    const channel = await User.findById({ _id: channelId });

    if (!channel) {
        throw new ApiError(400, "Channel is not found with given channel Id");
    }
    // name and avatar
    const subscriber = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "subscriber",
                as: "subscribers",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            _id: 0,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                subscriberCount: { $size: "$subscribers" },
            },
        },
        // {
        //     $project: {
        //         subscribers: 1,
        //     },
        // },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscriber,
                "All subscribers fetched successfully"
            )
        );
});

// channelId
const getAllSubscriptions = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!channelId || !isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is not provided or invalid");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(400, "Channel not found with given id");
    }

    const subscription = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "channel",
                as: "subscription",
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
    ]);

    if (subscription?.length === 0) {
        throw new ApiError(404, "No Subscription found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, subscription, "Data fetched successfully"));
});

export { getAllSubscribers, getAllSubscriptions, toggleSubscription };
