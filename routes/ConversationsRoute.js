import express from 'express'
import { authJWT } from '../controllers/authJWT.js'
import { createNewConversation,getUsersConversations } from '../controllers/conversationController.js'

const router = express.Router()

router.get('/',authJWT,getUsersConversations)

router.get('/create/:secondUserID', authJWT,createNewConversation)



export default router