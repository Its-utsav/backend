import User from "../models/user.model.js";
import asyncHandler from "../utils/asycnHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { unlinkSync } from "fs"

const checkExistingUser = asyncHandler(async (req, res, next) => {
    const { username, email } = req.body;
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        if (req.files) {
            if (req.files.avatar) {
                unlinkSync(req.files.avatar[0].path)
            }
            if (req.files.coverImage) {
                unlinkSync(req.files.coverImage[0].path)
            }
        }
        throw new ApiError(409, "User with name or email already exits")
    }
    next();
})


export {
    checkExistingUser
}