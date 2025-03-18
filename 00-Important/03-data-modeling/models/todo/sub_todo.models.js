import mongoose from "mongoose";

const subtodoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const Subtodo = mongoose.model("Subtodo", subtodoSchema)