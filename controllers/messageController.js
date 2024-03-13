import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"


export const sendMessage = async(req,res) =>{
    try {
       const msg = await new Message({
            senderId: req.user._id,
            receiverId: req.params.recieverID,
            conversationId: req.params.conversationID,
            text: req.body.text
        }).save() 
        return res.status(200).send(
            {   
                _id: msg._id,
                text: msg.text,
                receiverId: msg.receiverId,
                senderId: msg.senderId,
                createdAt: msg.createdAt,
                updatedAt: msg.updatedAt,
            })
    } catch (error) {
        console.log(error)
        return res.status(500).send("Error")
    }
    
}
export const getMessages = async(req,res) =>{
    try {
        const conversation = await Conversation.findById(req.params.conversationID)
        if(conversation.users.includes(req.user._id)){
            const messagesArray = await Message.find({conversationId: req.params.conversationID})
            console.log(messagesArray[0])
            return res.status(200).send(messagesArray)
        }
        return res.sendStatus(500)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send("Error")
    }
}