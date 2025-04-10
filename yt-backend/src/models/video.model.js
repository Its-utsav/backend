import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoUrl: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            min: [10, "Title with at least 5 character"],
        },
        description: {
            type: String,
        },
        duration: {
            type: Number,
            min: 0,
            required: true,
        },
        views: {
            type: Number,
            min: 0,
            default: 0,
            required: true,
        },
        isPublish: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

const Video = model("Video", videoSchema);

export default Video;
