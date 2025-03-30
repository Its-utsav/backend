import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectToDB = async () => {
    try {
        const connectionObject = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Database connectd on DB host ${connectionObject.connection.host}`)
    } catch (error) {
        console.error("Error while connecting to db \n", error);
        process.exit(1)
    }
}


export default connectToDB