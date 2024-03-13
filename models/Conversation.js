import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    users: {
        type: [String],
        required: true,
    }
    
},{timestamps: true})

export default mongoose.model("Conversation",ConversationSchema)