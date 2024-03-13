import express from 'express'
import { createUser, handleUpdateUserPassword, displayAllUsers, handleLogin, handleLogout, passwordReminder, verifyUser, addFriend, removeFriend, findUserByID, findUserByName, sendFriendRequest, declineFriendRequest } from '../controllers/userController.js'
import { authJWT } from '../controllers/authJWT.js'

const router = express.Router()

router.get('/',authJWT, displayAllUsers)
router.get('/find/:userID', authJWT, findUserByID)
router.get('/findByName',authJWT,findUserByName)

router.get('/:id/verify/:token', verifyUser)
router.post('/remind', passwordReminder)

router.post('/',createUser)
router.post('/update/userPassword', authJWT,handleUpdateUserPassword)
router.get('/logout',authJWT,handleLogout)
router.post('/login',handleLogin)


router.get('/friends/add/:friendID',authJWT,addFriend)
router.get('/friends/sendRequest/:friendID',authJWT,sendFriendRequest)
router.get('/friends/declineRequest/:friendID', authJWT, declineFriendRequest)
router.get('/friends/remove/:friendID',authJWT,removeFriend)



export default router