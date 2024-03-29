import mongoose from "mongoose";

const Token = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600
    }   
})

export default mongoose.model("Token",Token)