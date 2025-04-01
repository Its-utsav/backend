import asyncHandler from "../utils/asycnHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    return res.json({
        title: "Register",
        message: "ok",
    });
});

const loginUser = asyncHandler(async (req, res) => {
    return res.json({
        title: "Login",
        message: "ok",
    });
});

export { registerUser, loginUser };
