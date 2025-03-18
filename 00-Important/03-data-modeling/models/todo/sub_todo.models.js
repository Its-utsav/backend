import { Schema, model } from "mongoose";

const subtodoSchema = new Schema({
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

export const Subtodo = model("Subtodo", subtodoSchema)