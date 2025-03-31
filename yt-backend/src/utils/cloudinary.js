import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
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
            allowed_formats: ["gif", "mp4", "mkv", "jpg", "png"]
        });
        fs.unlinkSync(localPath);
        return fileUploadResponse;
    } catch (error) {
        fs.unlinkSync(localPath);
        console.error(`Unable to upload file on cloudnary errors:- \n${error}`);
        return null;
    }
};

export { uploadOnCloudinary };
