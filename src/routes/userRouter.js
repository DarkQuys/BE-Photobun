const express = require("express");
const userController = require('../controller/userController')
const authMiddleWare = require('../middleware/authMiddleWare')
const router = express.Router()
    router.get('/test'  , userController.test)
    router.post('/createuser', userController.createUser)
    router.get('/getalluser', userController.getAllUser)
router.get('/getuserdetail/:id', authMiddleWare.authUserMiddleWare, userController.getUserDetail)
router.put('/update-us', userController.upUs)
router.post('/loginuser', userController.loginUser)
router.post('/forgot-password', userController.forgotPassword)
router.put('/reset-password/:token', userController.resetPassword)
router.post('/refreshtoken', userController.refreshToken) 

    
module.exports= router 