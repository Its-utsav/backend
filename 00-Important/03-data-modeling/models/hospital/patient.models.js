import { Schema, model } from "mongoose"


const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    diseases: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bloodGroup: {
        enum: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        required: true
    },
    gender: {
        enum: ["MALE", "FEMALE", "OTHER"],
        required: true
    },
    admittedHospital: {
        type: Schema.Types.ObjectId,
        ref: "Hosptial"
    }
}, { timestamps: true })

export const Patient = model("Patient", patientSchema)