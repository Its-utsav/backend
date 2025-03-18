import { Schema, model } from "mongoose";

const todoSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subTodos: {
        // Array of sub todo
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "subtodo"
            }
        ]
    },
    colors: {
        type: String,
        enum: {
            values: ['red', 'green', "blue"],
            message: "{VALUE} is not supprted"
        },
    }
}, { timestamps: true })

export const todo = model("todo", todoSchema)