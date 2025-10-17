const Message = require('../model/message')
let io;

function initSocket(socketInstance) {
  io = socketInstance;
}

const getMess = (room) => {
    return new Promise(async (resolve, reject) => {
        try {
            const messages = await Message.find({ room })
             //.sort({ createdAt: 1 })   // mới nhất trước
             .limit(40);   
        console.log(io)
            resolve({
                messages
            })
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
    
}
const addMess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {sender , content, room} = data
            const messages = await Message.create({ sender , content , room })
            resolve({
                messages
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
    getMess,
    addMess,
    initSocket
}