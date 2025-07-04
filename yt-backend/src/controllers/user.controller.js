import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    deleteFromCloudinary,
    deleteManyFromCloudinary,
    getPublicIDByURL,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import Tweet from "../models/tweet.model.js";
import Comment from "../models/comments.model.js";
import Video from "../models/video.model.js";
import Subscription from "../models/subscription.model.js";

const options = {
    httpOnly: true,
    secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
    /**
     * 1. get the data like fullName, email , password
     * 2. If any none data is missing the send error with message all three filed is required
     * 3. If all data is recived apply basic validation like remove tralling and leading whitespace , everything in lowercase , no number for fullName
     * 4. If anything go wrong give error to the user
     * 5. If everything is ok than try to save data in mongoDB
     * 6. If data is saved in DB than return success response
     */
    const { username, fullName, email, password } = req.body;
    if (!username || !fullName || !email || !password) {
        throw new ApiError(
            400,
            "All four field fullName , username, email and password is required"
        );
    }
    // check white space
    if (
        [username, fullName, email, password].some((val) => val?.trim() === "")
    ) {
        throw new ApiError(
            400,
            "All four field fullName , username, email and password is required it can not be empty"
        );
    }

    if (!isNaN(fullName)) {
        throw new ApiError(400, "fullName can't include numbers");
    }

    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegEx.test(email)) {
        throw new ApiError(400, "Email should be in proper format");
    }

    // find user by either email or name

    if (password.length < 8) {
        throw new ApiError(400, "Password length should at least eight");
    }

    if (!req.files.coverImage || !req.files.avatar) {
        throw new ApiError(400, "Please upload cover image and avatar image");
    }

    const coverImagePath = req.files.coverImage[0].path;
    const avatarPath = req.files.avatar[0].path;

    if (!coverImagePath) {
        throw new ApiError(400, "Please upload cover image");
    }

    if (!avatarPath) {
        throw new ApiError(400, "Please upload avatar image");
    }

    let coverImage = await uploadOnCloudinary(coverImagePath);
    let avatar = await uploadOnCloudinary(avatarPath);

    if (!coverImage || !avatar) {
        throw new ApiError(400, "Unable to upload files");
    }

    coverImage = coverImage.url;
    avatar = avatar.url;

    const createdUser = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        coverImage,
        avatar,
    });

    const findCreatedUser = await User.findById(createdUser._id).select(
        "-password -refreshToken"
    );

    if (!findCreatedUser) {
        throw new ApiError(500, "Unable to register user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User register successfully"));
});

const generateRefreshTokenAndAccessToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken; // add into user object now need to save
        // Password , email , username like fileds are required so we need to give that values but we are generating the refreshToken and just save it
        // By default mongoose will try to validate it so we need to stop it .
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Error while generating the access token and referesh token"
        );
    }
};

const loginUser = asyncHandler(async (req, res) => {
    /**
     * 1. get data from front end like  email , password
     * 2. Verify that data by checking the username and email
     * 3. Verify the password
     * 4. Generate access token and refresh token send to user by storing into cookie
     * 5. send response
     */
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(401, "Please provide email for login");
    }

    const existingUser = await User.findOne({
        email,
    });

    if (!existingUser) {
        throw new ApiError(400, `User does not exist`);
    }

    const passWordcheck = await existingUser.isPasswordCorrect(password);
    if (!passWordcheck) {
        throw new ApiError(401, `Invalid user password`);
    }

    const { accessToken, refreshToken } =
        await generateRefreshTokenAndAccessToken(existingUser._id);

    // send to cookie
    // we have user document with password , email etc ...
    // but we do not send password to cookie

    const loggedInUser = await User.findById(existingUser._id).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { ...loggedInUser.toObject(), accessToken, refreshToken }, // consider as good
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    /**
     * 1. Clear cookies
     * 2. remove refreshToken token , but how we need to figure out user and than remove the refresh token
     * 3. one way is that get user email from form and logout but anyone user can logout anyone LOL
     */

    const id = req.user._id;
    await User.findByIdAndUpdate(
        id,
        {
            $set: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    /**
     * MOTO:- refreshToken access token
     * 1. get refreshToken from cookie
     * 2. decode and verify the token
     * 3. compare with DB refersh token
     * 4. genrate accessToken and send to the user in cookie
     */

    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodeInfo = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN
        );

        if (!decodeInfo) {
            throw new ApiError(401, "Unauthorized request");
        }

        const user = await User.findById(decodeInfo._id);

        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        if (incomingRefreshToken != user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } =
            await generateRefreshTokenAndAccessToken(user._id);

        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error.message);
    }
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.user?._id;
    const user = await User.findById(id);
    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isOldPasswordCorrect) {
        throw new ApiError(400, "Incorrect Password");
    }

    user.password = newPassword;
    await user.save({
        validateBeforeSave: false,
    });
    return res.status(200).json(new ApiResponse(200, "Password changes"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.json(new ApiResponse(200, req.user, "User fetched succesfully"));
});

const updateFullNameAndEmail = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!(email && fullName)) {
        throw new ApiError(400, "Provide email and fullname");
    }

    const userId = req.user?._id;

    const updatedUserInfo = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                email,
                fullName,
            },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, "User data updated successfully", {
            user: updatedUserInfo,
        })
    );
});

const avatarUpdate = asyncHandler(async (req, res) => {
    try {
        const avatarPath = req.file.path;
        if (!avatarPath) {
            throw new ApiError(400, "Avatar file is missing");
        }

        const user = await User.findById(req.user?._id).select("avatar");

        if (!user || !user.avatar) {
            throw new ApiError(500, "Unable to retrive old url");
        }
        const publicId = getPublicIDByURL(user.avatar);
        const avatar = await uploadOnCloudinary(avatarPath);
        await deleteFromCloudinary(publicId);

        if (!avatar) {
            throw new ApiError(400, "Unable to upload avatar on cloudinary");
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar.url,
                },
            },
            {
                new: true,
            }
        ).select("-password -refreshToken");

        return res.status(200).json(
            new ApiResponse(200, "Avatar update succesfully", {
                user: updatedUser,
            })
        );
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    "An unexpected error occurred , unable to upload avatar on cloudinary"
                )
            );
    }
});

const coverImageUpdate = asyncHandler(async (req, res) => {
    try {
        const coverImagePath = req.file.path;
        if (!coverImagePath) {
            throw new ApiError(400, "Cover image is missing");
        }
        const user = await User.findById(req.user?._id).select("coverImage");
        if (!user || !user.avatar) {
            throw new ApiError(500, "Unable to retrive old url");
        }
        const publicId = getPublicIDByURL(user.coverImage);
        const coverImage = await uploadOnCloudinary(coverImagePath);
        await deleteFromCloudinary(publicId);

        if (!coverImage) {
            throw new ApiError(
                400,
                "Unable to upload cover image on cloudinary"
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    coverImagePath: coverImage.url,
                },
            },
            {
                new: true,
            }
        ).select("-password -refreshToken");

        return res.status(200).json(
            new ApiResponse(200, "Cover image update succesfully", {
                user: updatedUser,
            })
        );
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    "An unexpected error occurred , unable to upload cover image on cloudinary"
                )
            );
    }
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    /***
     * Get the info of the current channle as per the username
     * total subscribers (followers) and subscribed(following)
     */

    const username = req.params.username;
    if (!username) {
        throw new ApiError(404, "username is missing");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase(),
            },
        },
        {
            // find user who subscribe this channel - followers
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        {
            // find following
            // find the all channel that is subscried by this user / channel
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },
        {
            // get count
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers",
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo",
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1,
                subscriberCount: 1,
                isSubscribed: 1,
                channelsSubscribedToCount: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                `Data fetched for ${username} channel`
            )
        );
});

const getWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            // get a history
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    // {
                    //     $project: {
                    //         username: 1,
                    //         avatar: 1,
                    //         fullName: 1
                    //     }
                    // }
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                ],
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        );
});

const deleteUser = asyncHandler(async (req, res) => {
    // If user delete that means all tweets , video , comments should also deleted
    const userId = req.user._id;
    const session = await mongoose.startSession();
    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
        throw new ApiError(404, "User not found");
    }

    try {
        session.startTransaction();
        const tweetDelete = await Tweet.deleteMany({ owner: userId }).session(
            session
        );
        if (!tweetDelete.acknowledged) {
            session.abortTransaction();
            throw new ApiError(
                500,
                "Internal server error while deleting user"
            );
        }

        const commentDelete = await Comment.deleteMany({
            owner: userId,
        }).session(session);

        if (!commentDelete.acknowledged) {
            session.abortTransaction();
            throw new ApiError(
                500,
                "Internal server error while deleting user"
            );
        }

        const videos = await Video.find({ owner: userId });

        if (videos.length >= 1) {
            const videoPublicId = videos.map((video) =>
                getPublicIDByURL(video.videoUrl)
            );
            const thumbnailPublicId = videos.map((video) =>
                getPublicIDByURL(video.thumbnailUrl)
            );

            await deleteManyFromCloudinary(videoPublicId); // video delete
            await deleteManyFromCloudinary(thumbnailPublicId); // thumbnail delete

            const deleteVideos = await Video.deleteMany({
                owner: userId,
            }).session(session);

            if (!deleteVideos.acknowledged) {
                session.abortTransaction();
                throw new ApiError(
                    500,
                    "Internal server error while deleting user"
                );
            }
        }

        const subscription = await Subscription.deleteMany({
            $or: [{ subscriber: userId }, { channel: userId }],
        }).session(session);

        if (!subscription.acknowledged) {
            await session.abortTransaction();
            throw new ApiError(
                500,
                "Internal server error while deleting user"
            );
        }

        const userDelete =
            await User.findByIdAndDelete(userId).session(session);
        if (!userDelete) {
            throw new ApiError(
                500,
                "Internal server error while deleting user"
            );
        }
        await session.commitTransaction();

        return res
            .status(200)
            .json(new ApiResponse(200, "User Delete succesfully"));
    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(500, error.message || "Internal server error");
    } finally {
        await session.endSession();
    }
});

export {
    avatarUpdate,
    changePassword,
    coverImageUpdate,
    getCurrentUser,
    getPublicIDByURL,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateFullNameAndEmail,
    deleteUser,
};
