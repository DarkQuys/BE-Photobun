const Chat = require('../model/chatModel')
const Message1 = require('../model/mesageModel')
const createChat = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
           const { idMe,idYour } = data
               if (!idYour) {
                 reject({
                    message: "idYour param not sent with request"
                })
             
               }
           
               const chat = await Chat.findOne({
                 isGroupChat: false,
                 users: { $all: [idMe, idYour] },
               }).populate("users", "-password")
           
            if (chat) {
                const fullmessage = await Message1.findOne({
                       chat :chat._id
                   })
                resolve({
                    status: 'good',
                    Chat: chat,
                    fullmessage:fullmessage
                })
               } else {
                 const newChat = await Chat.create({
                   chatName: "sender",
                   isGroupChat: false,
                   users: [idMe, idYour],
                 });
                 
                 const fullChat = await Chat.findOne({ _id: newChat._id })
                       .populate("users", "-password");
                   resolve({
                       status: 'created',
                       Chat : fullChat
                   })
               }
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
    
}

const getAllChat = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await Chat.find()
            .populate('users','_id email' )
            resolve({
                status: 'good', 
                data :data 
            })
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
    
}

module.exports = {
    createChat,
    getAllChat
}