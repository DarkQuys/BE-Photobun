const mongoose = require("mongoose");

const messageSchema =new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const Message1 = mongoose.model("Message1", messageSchema);
module.exports = Message1;