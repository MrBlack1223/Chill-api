import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    PWZNumber: {
        type: Number,
        required: true,
        unique: true
    },
    specialization: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false,
        unique: false,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    }
})

export default mongoose.model("Doctor",DoctorSchema)