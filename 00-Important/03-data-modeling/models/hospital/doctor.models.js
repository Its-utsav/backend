import { Schema, model } from "mongoose"

const doctorWorkingHosptial = new Schema({
    hostpitls: {
        type: Schema.Types.ObjectId,
        ref: "Hosptial"
    },
    workingHours: {
        type: Number,
        default: 0
    }
})

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experienceInYear: {
        type: Number,
        default: 0,
    },
    worksInHospital: [doctorWorkingHosptial]
}, { timestamps: true })

export const Doctor = model("Doctor", doctorSchema)