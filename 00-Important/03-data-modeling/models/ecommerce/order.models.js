import { Schema, model } from "mongoose";

const productsSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    qty: {
        type: Numebr,
        required: true,
    }
})

const orderSchema = new Schema({
    // User buying items
    products: {
        type: [productsSchema],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "DELIVERED"],
        default: "PENDING"
    }
}, { timestamps: true })

export const Order = model("Order", orderSchema)
