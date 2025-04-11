import Video from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    deleteFromCloudinary,
    getPublicIDByURL,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";

// verifyUser -> req.user._id
const getAllVideos = asyncHandler(async (req, res) => {
    const allVideos = await Video.find();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { videos: allVideos },
                "All videos fetched succesfully"
            )
        );
});

const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title || title?.trim() === "") {
        throw new ApiError(400, "Title can not be empty");
    }
    if (!req.files.video || !req.files.thumbnail) {
        throw new ApiError(400, "Video and thumbnail both need to upload");
    }
    // videoUrl: thumbnail: owner: title:
    const videoPath = req.files.video[0].path;
    const thumbnailPath = req.files.thumbnail[0].path;

    if (!videoPath) {
        throw new ApiError(400, "Video must need to upload");
    }

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail must need to upload");
    }

    let video = await uploadOnCloudinary(videoPath);
    let thumbnail = await uploadOnCloudinary(thumbnailPath);

    if (!video) {
        throw new ApiError(
            500,
            "something went wrong while uploading video please try again"
        );
    }

    if (!thumbnail) {
        throw new ApiError(
            500,
            "something went wrong while uploading thumbnail please try again"
        );
    }
    // secure_url //  duration

    const newVideo = await Video.create({
        videoUrl: video.secure_url,
        thumbnailUrl: thumbnail.secure_url,
        owner: req.user._id,
        title,
        description,
        duration: video.duration,
    });
    if (!newVideo) {
        const videoPublicId = getPublicIDByURL(video.secure_url);
        const thumbnailPublicId = getPublicIDByURL(thumbnail.secure_url);
        await deleteFromCloudinary(videoPublicId);
        await deleteFromCloudinary(thumbnailPublicId);
        throw new ApiError(500, "something went wrong while upload video");
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { video: newVideo },
                "Video upload successfully"
            )
        );
});

// videoId
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Video id is not provided");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
});
//
const updateVideo = asyncHandler(async (req, res) => {
    // console.log(req.file);
    // thumbnail , title , description -> update
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Video Id is not provided");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner._id.toString() != req.user._id.toString()) {
        throw new ApiError(401, "You can't update other's video deatils");
    }

    const { title, description } = req.body;
    if (title && title?.trim() == "") {
        throw new ApiError(400, "Title can not be empty");
    }

    if (req.file && req.file.path) {
        const newThumbnailUrl = await uploadOnCloudinary(req.file.path);
        const oldThumbnailUrl = getPublicIDByURL(video.thumbnailUrl);
        await deleteFromCloudinary(oldThumbnailUrl);
        video.thumbnailUrl = newThumbnailUrl.secure_url;
    }
    video.title = title;
    video.description = description?.trim() || video.description; // todo need to fix
    const updatedVideo = await video.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { video: updatedVideo },
                "Video updated successfully"
            )
        );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(400, "Video Id is not provided");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner._id.toString() != req.user._id.toString()) {
        throw new ApiError(401, "You can't delete other's video ");
    }

    const delVideo = await video.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, delVideo, "Video deleted"));
});

export { deleteVideo, getAllVideos, getVideoById, updateVideo, uploadVideo };
