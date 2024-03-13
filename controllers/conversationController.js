import bcrypt from 'bcrypt'
import Conversation from '../models/Conversation.js'

export const createNewConversation = async(req,res)=>{
    try{
        const user1 = req.user._id
        console.log(`logged user: ${user1}`)
        const user2 = req.params.secondUserID
        console.log(`requested user: ${user2}`)
        const isUnique = await Conversation.findOne({ $or: [{users:[user1,user2]}, {users:[user2,user1]} ] })
        console.log(`is unique ${isUnique}`)
        if(!isUnique){
            const conv = await new Conversation({users: [user1,user2]}).save()
            console.log(`conv id: ${conv._id}`)
            return res.status(200).send(conv._id)
        }
        return res.status(200).send(isUnique._id)
    }catch(error){
        res.json('Something went wrong')
    }
} 

export const getUsersConversations = async(req,res)=>{
    try {
        const user1 = req.user._id
        const conversations = await Conversation.find({users:{"$in" : [user1]}})
        res.status(200).send(conversations)
    } catch (e) {
        res.json('Something went wrong')
    }
}