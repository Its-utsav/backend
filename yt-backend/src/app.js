import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        limit: "16kb",
        extended: true,
    })
);

app.use(express.static("../public"));
app.use(cookieParser());

// imports routes
import userRoutes from "./routes/user.routes.js";

// routes decelration
app.use("/api/v1/users", userRoutes);

export default app;
