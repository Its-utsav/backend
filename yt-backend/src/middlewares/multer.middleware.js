import multer from "multer";

export const uploadingWithMulter = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "./public/temp/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
