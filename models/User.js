import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    login: {
        type: String,
        required: true,
        unique: true
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
        type: {
            text: String,
            temporary: Boolean
        },
        required: true,
        unique: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    friendsRequest: {
        type: [String],
        default: [],
    },
    friends: {
        type: [String],
        default: [],
    }
})

export default mongoose.model("User3",UserSchema)