const chatService =  require('../sevices/chatService')
const createChat = async (req, res) => {
    try {
        const response  = await chatService.createChat(req.body)
        return res.status(200).json(response)
    }catch(e){
        return req.status(404).json({
            message : e
        })
    }   

}

const getAllChat = async (req, res) => {
    try {
        
        const response  = await chatService.getAllChat()
        return res.status(200).json(response)
    }catch(e){
        return req.status(404).json({
            message : e
        })
    }   

}

module.exports = {
    
    createChat,
    getAllChat
}