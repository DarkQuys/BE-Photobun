const messageService= require('../sevices/messageService')

const sendMessage = async (req, res) => {
    try {
        const data = req.params.room
        const response  = await messageService.sendMessage(req.body)
        return res.status(200).json(response)
    }catch(e){
        return req.status(404).json({
            message : e
        })
    }   

}
const getMessage = async (req, res) => {
    try {
        const data = req.params.room
        const response  = await messageService.getMessage(data)
        return res.status(200).json(response)
    }catch(e){
        return req.status(404).json({
            message : e
        })
    }   

}
// const createMessage = async (req, res) => {
//     try {
//         const room = req.params.room

//         const response  = await messageService.createMessage(req.body,room)
//         return res.status(200).json(response)
//     }catch(e){
//         return req.status(404).json({
//             message : e
//         })
//     }   

// }
module.exports = {
    sendMessage,
    // createMessage
    getMessage
}