import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            index: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refershToken: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    // we need to hash password only when password is added first time or only modified
    // password encyrption takes time
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.username,
            fullName: this.fullName,
            email: this.email,
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: process.env.REFERSH_TOKEN,
        }
    );
};

userSchema.methods.generateRefershToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFERSH_TOKEN,
        {
            expiresIn: process.env.REFERSH_TOKEN_EXPIRY,
        }
    );
};

const User = model("User", userSchema);

export default User;
