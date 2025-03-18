import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        min: 8,
        // required: [true, "password is required"],
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
})

export const User = mongoose.model("User", userSchema)