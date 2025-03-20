import { Schema, model } from "mongoose"

const addressSchema = new Schema({
    StreetName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        max: 6,
        min: 6
    }
})

const hosptialSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    addressLine1: {
        type: addressSchema,
        required: true
    },
    addressLine2: {
        type: addressSchema,
    },
    specializedIn: {
        type: String
    }
})

export const Hosptial = model("Hosptial", hosptialSchema)