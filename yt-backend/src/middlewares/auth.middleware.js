import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asycnHandler.js";

export const verifyUser = asyncHandler(async (req, _, next) => {
    try {
        // Our client might be mobile app 
        const token =
            req.cookie?.accessToken ||
            req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodeInfo = jwt.verify(token, process.env.ACCESS_TOKEN);

        if (!decodeInfo) {
            throw new ApiError(401, "Invalid access token");
        }

        const userInfo = await User.findById(decodeInfo._id).select(
            "-password -refershToken"
        );

        if (!userInfo) {
            throw new ApiError(401, "Invalid access token");
        }
        req.user = userInfo;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
});
