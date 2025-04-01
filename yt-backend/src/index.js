import app from "./app.js";
import connectToDB from "./db/index.js";

const PORT = process.env.PORT || 3000;

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port = ${PORT}`);
        });
    })
    .catch(() => {
        console.log("Mongodb connection failed");
    });
