const express = require("express");
const mesController  = require('../controller/mesController')
const router = express.Router()
router.get('/get-mess/:room', mesController.getMess)
router.post('/add-mess'  , mesController.addMess)

    
module.exports= router 