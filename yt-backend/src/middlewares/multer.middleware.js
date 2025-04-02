import multer from "multer";

export const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "./public/temp/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

export const uploadWithMulter = multer({ storage });
