import { Schema, model } from "mongoose";

const likeSchema = new Schema(
    {
        // comment
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        // video
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
        // tweet
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet",
        },
        likeBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Like = model("Likes", likeSchema);

export default Like;
