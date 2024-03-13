import express from 'express'
import { authJWT } from '../controllers/authJWT.js'
import { getMessages, sendMessage } from '../controllers/messageController.js'

const router = express.Router()

router.get('/:conversationID',authJWT,getMessages)

router.post('/send/:recieverID/:conversationID',authJWT,sendMessage)


export default router