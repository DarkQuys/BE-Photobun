const Message1 = require('../model/mesageModel')
const Chat = require('../model/chatModel')
const sendMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
           const { content, chatId , idSender } =data;
             const newMessage = await Message1.create({
               sender: idSender,
               content,
               chat: chatId,
             });
         
           //  await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });
         
             const populatedMessage = await Message1.findById(newMessage._id)
               .populate("sender", "name email")
               .populate("chat");
          resolve({
            status: "good",
            data:populatedMessage
               })
           
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
    
}
const createMessage = (data) => {
  return new Promise(async (resolve, reject) => {
      try {
         const { content, chatId , idSender } =data;
           const newMessage = await Message1.create({
             sender: idSender,
             content,
             chat: chatId,
           });
       
         //  await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });
       
           const populatedMessage = await Message1.findById(newMessage._id)
             .populate("sender", "name email")
             .populate("chat");
       
           res.json(populatedMessage);
      }
      catch (e) {
          reject({
              status : "Create error"
          })
      }        
  })
  
}
const getMessage = (data) => {
  return new Promise(async (resolve, reject) => {
      try {
        const mess = await Message1.find({
         chat : data
        }).populate("sender")
        resolve({
          status: "good",
          data : mess
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
  sendMessage,
  getMessage
}