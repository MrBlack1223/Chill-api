import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt  from 'jsonwebtoken'
import { sendEmail } from '../utils/sendEmail.js'
import crypto from 'crypto'
import Token from '../models/Token.js'

export const createUser = async(req,res)=>{
    try{
        const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$')
        const nameRegex = new RegExp('^[A-Za-z0-9]{3,16}$')
        if(!nameRegex.test(req.body.name)) return res.status(500).send('Username should be 3-16 characters and shouldnt include any special character!')
        if(!passwordRegex.test(req.body.password)) return res.status(500).send('Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!')
        const hashedPassword = bcrypt.hashSync(req.body.password,10)
        
        const user = await new User({...req.body, password: {text: hashedPassword, temporary: false}}).save()
        
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save()

        const url = `${process.env.BASE_URL}/user/${user._id}/verify/${token.token}`

        await sendEmail(req.body.email,"Verify your account",url)

        res.sendStatus(200)
    }catch(error){
        res.sendStatus(403)
    }
} 
export const handleLogin = async(req,res)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user) return res.sendStatus(401)

        const match = await bcrypt.compare(req.body.password, user.password.text);
        if (!match) return res.sendStatus(403)
        
        if(!user.verified){
            let token = await Token.findOne({userId: user._id})
            if(!token){
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save()
    
            const url = `${process.env.BASE_URL}/user/${user._id}/verify/${token.token}`
            await sendEmail(req.body.email,"Verify your account",url)
            }
            
            return res.status(400).send({message: "Please verify your email, message has been send"})
        }

        const userWithNoPassword = {...user._doc, password: null, isPassTemporary: user._doc.password.temporary}

        const token = jwt.sign({user: userWithNoPassword}, process.env.TOKEN_SECRET, { expiresIn: '600s' })
        const refreshToken = jwt.sign({_id: user._id},process.env.REFRESH_TOKEN, {expiresIn: '180d'})

        return res.cookie('jwt',token,{
            maxAge: 60 * 10 * 1000,
            secure: true,
            sameSite: 'none'
        }).status(200).send({user: userWithNoPassword,refreshToken: refreshToken})
    }catch(e){
        return res.send(e)
    }
}
export const refreshToken = async(req,res)=>{
    try{
        const rToken = req.body.refreshToken
        let id = ""
        jwt.verify(rToken,process.env.REFRESH_TOKEN, async (e,decoded)=>{
            if(e){
                return res.status(403).send("Wrong token")
            }
            id = decoded._id
        })

        const user = await User.findOne({_id: id})
        if(!user) return res.sendStatus(401)

        const userWithNoPassword = {...user._doc, password: null, isPassTemporary: user._doc.password.temporary}
        const token = jwt.sign({user: userWithNoPassword}, process.env.TOKEN_SECRET, { expiresIn: '600s' })

        return res.cookie('jwt',token,{
            maxAge: 60 * 10 * 1000,
            secure: true,
            sameSite: 'none'
        }).sendStatus(200)
    }catch(e){
        console.log(e)
    }
}

export const verifyUser = async(req,res)=>{
    try{
        const user = await User.findOne({_id: req.params.id})
        if(!user) return res.sendStatus(400)
        
        const token = await Token.findOne({userId: user._id})
        if(!token) return res.sendStatus(400)
        
        await User.findByIdAndUpdate(user._id,{ verified: true})
        await Token.findByIdAndDelete(token._id)

        res.sendStatus(200)
    }catch(e){

    }
}
export const passwordReminder = async(req,res) =>{
    try{

        const user = await User.findOne({email: req.body.email})
        if(!user) return res.sendStatus(401)

        const password = crypto.randomBytes(12).toString("hex")
        const hashedPassword = bcrypt.hashSync(password, 10)

        await User.findByIdAndUpdate(user._id,{password: {text: hashedPassword, temporary: true}})

        await sendEmail(user.email, "Your new temporary password", `Your new temporary password is ${password} please change it after login`)
        
        return res.sendStatus(200)


    }catch(e){
        return res.send(e)
    }
}

export const handleLogout = async(req,res)=>{
    try{
        res.clearCookie('jwt',{
            maxAge: 10 * 60 * 1000,
            secure: true,
            sameSite: 'none',
    }).sendStatus(204)
    }catch(e){
        return res.send(e)
    }
}

export const displayAllUsers = async(req,res) =>{
    try{
        const allUsers = await User.find({})
        return res.send(allUsers).status(200)
    }catch(e){
        return res.send(e)
    }
}

export const handleUpdateUserPassword = async(req,res) =>{
    try{
        const passwordRegex = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$')
        if(!passwordRegex.test(req.body.password)) return res.sendStatus(403)
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        await User.findByIdAndUpdate(req.user._id, { password: {temporary: false, text: hashedPassword}})
        return res.sendStatus(200)
    }catch(err){
        return res.sendStatus(500)
    }
}

export const sendFriendRequest = async (req,res)=>{
    try {
        await User.findByIdAndUpdate(req.params.friendID,{$addToSet: { friendsRequest: req.user._id }})
        return res.status(200).send("request sent")
    } catch (error) {
        res.sendStatus(501)
    }
}  

export const declineFriendRequest = async (req,res)=>{
    try {
        await User.findByIdAndUpdate(req.user._id,{$pull: { friendsRequest: req.params.friendID  }})
        return res.status(200).send("request declined")
    } catch (error) {
        res.sendStatus(501)
    }
}

export const addFriend = async(req,res) =>{
    try {
        const newFriend = await User.findByIdAndUpdate(req.params.friendID,{$addToSet: { friends: req.user._id }})
        if(!newFriend) return res.sendStatus(500)
        await User.findByIdAndUpdate(req.user._id,{$pull: { friendsRequest: newFriend._id},$addToSet: { friends: newFriend._id }})
        return res.status(200).send("New friend has been added")
    } catch (e) {
        console.log(e)
    }
}

export const removeFriend = async(req,res) =>{
    try {
        const newFriend = await User.findByIdAndUpdate(req.params.friendID,{$pull: { friends: req.user._id }})
        if(!newFriend) return res.sendStatus(500)
        await User.findByIdAndUpdate(req.user._id,{$pull: { friends: newFriend._id }})
        return res.status(200).send("Friend has been removed")
    } catch (e) {
       console.log(e) 
    }
}

export const findUserByID = async(req,res) =>{
    try {
        const user = await User.findById(req.params.userID)
        const correctUser = {
            name: user.name,
            icon: user.icon
        }
        if(!user) return res.sendStatus(500)
        return res.status(200).send(correctUser)
    } catch (e) {
        console.log(e)
    }
}
export const findUserByName = async(req,res) =>{
    try {
        const query = req.query.q ? req.query.q : ''
        console.log(query)
        const users = await User.find({name: {'$regex': query,'$options' : 'i'}}).limit(4)
        const safeUsers = users.map(user=> user = user._doc._id)
        res.status(200).send(safeUsers)
    } catch (error) {
        res.status(500).send(error)
    }
}