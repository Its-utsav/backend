import { Schema, model } from "mongoose";

const addressSchema = new Schema({
	pincode: {
		type: Number,
		required: true,
		min: 6
	},
	city: {
		type: String,
		required: true,
		min: 5
	},
	state: {
		type: String,
		required: true,
		min: 3
	}
})

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		min: 8,
		required: true,
	},
	address: {
		type: addressSchema,
		required: true
	}
}, { timestamps: true },
);

export const User = model("User", userSchema);
