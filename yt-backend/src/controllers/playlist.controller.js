import mongoose from "mongoose";
import Playlist from "../models/playlist.model.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    console.log(name, description, req.body);
    if (!name || name?.trim() == "") {
        throw new ApiError(400, "Playlist must have any name");
    }

    const createdPlaylist = await Playlist.create({
        name: name,
        description: description?.trim(),
        owner: req.user._id,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { playlist: createdPlaylist },
                "Playlist created successfully"
            )
        );
});

// userId
const getUserPlaylist = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new ApiError(
            400,
            "Used Id is missing , unable to get user's playlist"
        );
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(400, "User not found with give user Id");
    }

    const userPlaylist = await Playlist.find({
        owner: new mongoose.Types.ObjectId(userId),
    });

    if (!userPlaylist || userPlaylist.length == 0) {
        throw new ApiError(404, "Empty playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlist: userPlaylist },
                "playlist fetch successfully"
            )
        );
});

// :playlistId
const getPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new ApiError(400, "Playlist Id is not provided");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist || playlist.length === 0) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

// name and description: {
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    console.log(name, description);
    if (!playlistId) {
        throw new ApiError(400, "Playlist id not provided");
    }

    if (name && name?.trim() == "") {
        throw new ApiError(400, "Playlist name can not be empty");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: name,
                description: description?.trim(),
            },
        },
        {
            new: true,
        }
    );

    if (!updatedPlaylist) {
        throw new ApiError(400, "Unable to update playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlist: updatedPlaylist },
                "Playlist update succesfully"
            )
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist id not provided");
    }

    const delPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!delPlaylist) {
        throw new ApiError(400, "Playlist is not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "playlist successfully deleted"));
});

// /:videoId/:playlistId
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;
    if (!videoId || !playlistId) {
        throw new ApiError(400, "Video Id or playlist Id not provided");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found with given id");
    }

    if (playlist.videos?.includes(video._id)) {
        throw new ApiError(400, "Video alredy in playlist");
    }

    playlist.videos.push(video);
    const updatedPlaylist = await playlist.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlist: updatedPlaylist },
                "Playlist updated successfully"
            )
        );
});

const deleteVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;
    if (!videoId || !playlistId) {
        throw new ApiError(400, "Video Id or playlist Id not provided");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "playlist not found");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found with given id");
    }

    const index = playlist.videos.indexOf(video._id);
    playlist.videos.splice(index, 1);
    const updatedPlaylist = await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlist: updatedPlaylist },
                "Video delete from playlist"
            )
        );
});

export {
    getPlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    getUserPlaylist,
    deleteVideoToPlaylist,
    addVideoToPlaylist,
};
