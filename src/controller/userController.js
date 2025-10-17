const User = require('../model/userModel')
const userService = require('../sevices/userSevice')
const jwtService= require('../sevices/jwtService')
const test = async (req, res) => {
    try{
        return res.status(200).json({
            message : "Good"
        })
    }catch(e){
        return req.status(404).json({
            message : e
        })
    }   

}
const createUser = async (req, res) => {
    try {
        const user = req.body 
        const response  = await userService.createUser(user)
        return res.status(200).json(response)
    }catch(e){
        return req.status(404).json({
            message : e
        })
    }   

}
const getUserDetail= async (req, res) => {
    try{ 
        const responese = await userService.getUserDetail(req.params.id)
        return res.status(200).json(responese)
    }
    catch(e){
        return res.status(404).json({
            message :e
        })

    }
}

const getAllUser = async (req, res) => {
    try {
        const response  = await userService.getAllUser()
        return res.status(200).json(response)
    }catch(e){
        return req.status(404).json({
            message : e
        })
    } 
}
const loginUser = async(req , res) => {
    try {
        const user = req.body 
        const response = await userService.loginUser(user) 
            const { refresh_token, ...newResponse } = response
             res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false, //true khi dùng https
                sameSite: 'strict',
                // path: '/',
                // maxAge: 7 * 24 * 60 * 60 * 1000 
            })
        return res.status(200).json(response)
        //return res.status(200).json(response)
    }catch(e){
        return res.status(e)
    }  
}
const upUs = async(req , res) => {
    try {
        const user = req.body 
        const response = await userService.upUs(user) 
        return res.status(200).json(response)
    }catch(e){
        return res.status(e)
    }  
}

const forgotPassword = async(req , res) => {
    try {
        const user = req.body 
        const response = await userService.forgotPassword(user) 
        return res.status(200).json(response)
    }catch(e){
        return res.status(e)
    }  
}
const resetPassword = async(req , res) => {
    try {
        const token = req.params.token 
        console.log(token)
        const response = await userService.resetPassword(req.body , token ) 
        return res.status(200).json(response)
    }catch(e){
        return res.status(e)
    }  
}
const refreshToken = async(req ,res)=>{
    try{ 
        //const token = await req.headers.token.split(' ')[1]
        const token = req.cookies.refresh_token
        console.log(token)
        if(!token){
            return res.status(404).json({
                status : "Not token"
            })
        }
        const respon = await jwtService.refreshToken(token)
        return res.status(200).json(respon)
    }
    catch(e){
        return res.status(404).json({
            message :'??'
        })

    }

}
module.exports = {
    test, 
    createUser,
    getAllUser,
    getUserDetail,
    loginUser,
    upUs,
    forgotPassword,
    resetPassword,
    refreshToken
}
