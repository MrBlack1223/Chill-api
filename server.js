import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from 'cors'
import userRoute from './routes/UserRoute.js'
import conversationRoute from './routes/ConversationsRoute.js'
import messageRoute from './routes/MessageRoute.js'

const PORT = 5000;

dotenv.config()
const app = express()

app.use(cookieParser())
app.use(cors({origin: "https://chill-xjjv.onrender.com", credentials: true}));
app.use(express.json())

const  connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB)
        console.log("db connected")
    }catch(e){
        console.log(e)
    }
}

app.use('/user',userRoute)
app.use('/conversation',conversationRoute)
app.use('/message', messageRoute)

app.listen(PORT,()=>{
    connect()
    console.log("server is running")
})