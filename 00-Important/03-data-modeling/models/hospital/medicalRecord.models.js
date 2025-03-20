import { Schema, model } from "mongoose"

const medicalHistorySchema = new Schema({
    diseases: {
        type: String,
        required: true
    },
    laboratoryResults: {
        type: String,
        required: true
    },
    treatments: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const medicalRecordSchema = new Schema({
    patientDeatils: {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    },
    medicalDeatils: [medicalHistorySchema]
})

export const MedicalRecord = model("MedicalRecord", medicalRecordSchema)