import { Schema, model } from "mongoose";

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	productImg: {
		type: String,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	availableStocks: {
		type: Number,
		required: true,
		min: 0,
		default: 0,
	},
	productCatgory: {
		type: Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
}, { timestamps: true, },
);

export const Product = model("Product", productSchema);
