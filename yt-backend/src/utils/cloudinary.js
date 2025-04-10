import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
/*
- first file will store in our local server for temparary
- after we upload that temparary file to cloudinary
- after successful upload we will remove that file 
*/

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
    if (!localPath) return null;
    try {
        const fileUploadResponse = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto",
            media_metadata: true,
        });
        fs.unlinkSync(localPath);
        // console.log(fileUploadResponse);
        return fileUploadResponse;
    } catch (error) {
        fs.unlinkSync(localPath);
        console.error(`Unable to upload file on cloudnary errors:- \n${error}`);
        return null;
    }
};

const getPublicIDByURL = (url) => url.split("/").pop().split(".")[0];

const deleteFromCloudinary = async (publicID) => {
    await cloudinary.uploader.destroy(publicID, (error) => {
        if (error) {
            throw new ApiError(500, "Exising file could not be deleted");
        }
    });
};

export { uploadOnCloudinary, deleteFromCloudinary, getPublicIDByURL };
