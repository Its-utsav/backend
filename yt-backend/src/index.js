// import "dotenv/config";

import express from "express";
import connectToDB from "./db/index.js";


const app = express();
const PORT = process.env.PORT || 8000;

connectToDB()



/*
(async () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`).then(res => {
            console.log("Database connected")
        })

        app.on("error", (error) => {
            console.error("app is not taking with db", error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`server started on ${PORT}`);
        });
    } catch (error) {
        console.error("Error while DB connection", error);
    }
})();
*/
