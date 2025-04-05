import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


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
                { loggedInUser, accessToken, refreshToken }, // consider as good
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
                refreshToken: null,
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
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));

    } catch (error) {
        throw new ApiError(401, error.message);
    }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
