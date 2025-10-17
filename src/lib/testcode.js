// models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "default-avatar.png" },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);
module.exports = User;

// models/chatModel.js
// const mongoose = require("mongoose");

// const chatSchema = mongoose.Schema(
//   {
//     chatName: { type: String, trim: true },
//     isGroupChat: { type: Boolean, default: false },
//     users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     latestMessage: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Message",
//     },
//     groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const Chat = mongoose.model("Chat", chatSchema);
// module.exports = Chat;

// models/messageModel.js
const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;



///

// controllers/userControllers.js
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/chatControllers.js
const Chat = require("../models/chatModel");

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "UserId param not sent with request" });
    }

    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    }).populate("users", "-password").populate("latestMessage");

    if (chat) {
      res.json(chat);
    } else {
      const newChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      
      const fullChat = await Chat.findOne({ _id: newChat._id })
        .populate("users", "-password");
      res.status(201).json(fullChat);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGroupChat = async (req, res) => {
  try {
    const { users, name } = req.body;
    if (!users || !name) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: [...users, req.user._id],
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/messageControllers.js
const Message = require("../models/messageModel");
//const Chat = require("../models/chatModel");

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    const newMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email")
      .populate("chat");

    res.json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};