const express = require("express");
const chatControllers = require('../controller/chatController')
const authMiddleWare = require('../middleware/authMiddleWare')
const router = express.Router()
    router.post('/access-chat'  , chatControllers.createChat)
    router.get('/all-chat'  , chatControllers.getAllChat)
module.exports= router 