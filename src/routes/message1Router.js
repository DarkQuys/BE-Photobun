const express = require("express");
const messageController  = require('../controller/messageController')
const router = express.Router()
router.post('/send-message', messageController.sendMessage)
router.get('/get-message/:room', messageController.getMessage)


    
module.exports= router 