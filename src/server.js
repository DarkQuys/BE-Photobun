const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const mysql = require('mysql2/promise');
const http = require('http');
const Message = require('./model/message')
const  {initSocket} = require('./sevices/mesService')
const { Server } = require('socket.io');
var cookieParser = require('cookie-parser')
var cors = require('cors')
dotenv.config()
const app = express()
// const port = 3003 
app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' })); 
app.use(bodyParser.json())
app.use(cookieParser())
routes(app)

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
// Mongoose model (simple)
const NumberSchema = new mongoose.Schema({
  num: Number,
  status: { type: String, enum: ['waiting','served','called'], default: 'waiting' },
  phone: String,
  name: String,
  createdAt: { type: Date, default: Date.now },
});
const QueueNumber = mongoose.model('QueueNumber', NumberSchema);

// In-memory helper to keep current being served (persist also in DB)
let currentServing = 0;

// socket connection
io.on('connection', socket => {
  console.log('client connected', socket.id);
  // send initial status
  socket.emit('status', { currentServing });
});

// API: lấy trạng thái chung
app.get('/api/status', async (req, res) => {
  res.json({ currentServing });
});

// API: tạo số mới
app.post('/api/take', async (req, res) => {
  // simple: next number = max num +1
  const last = await QueueNumber.findOne().sort({ num: -1 }).exec();
  const nextNum = last ? last.num + 1 : 1;
  const doc = await QueueNumber.create({
    num: nextNum,
    name: req.body.name || '',
    phone: req.body.phone || ''
  });
  // emit update (optional: count waiting)
  io.emit('new-number', { num: nextNum });
  res.json({ success: true, number: nextNum, id: doc._id });
});

// API: admin advance (bắt đầu phục vụ số tiếp theo)
app.post('/api/advance', async (req, res) => {
  // find next waiting with num > currentServing
  const next = await QueueNumber.findOne({ num: { $gt: currentServing }, status: 'waiting' }).sort({ num: 1 }).exec();
  if (!next) return res.json({ success: false, message: 'No waiting' });
  currentServing = next.num;
  next.status = 'called';
  await next.save();
  io.emit('status', { currentServing });
  res.json({ success: true, currentServing });
});
// lấy số cho admin
app.get('/api/waiting', async (req, res) => {
  const waiting = await QueueNumber.find({ status: 'waiting' })
    .sort({ num: 1 })
    .select('num name phone');
  res.json(waiting);
});

// API: lấy toàn bộ danh sách trong DB
app.get('/api/all', async (req, res) => {
  const list = await QueueNumber.find().sort({ num: 1 });
  res.json(list);
});

// API: xóa 1 bản ghi theo id
app.delete('/api/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await QueueNumber.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

mongoose.connect(`${process.env.URL_MONGODB}`)
    .then(() => console.log('Connected!')) 
    .catch ((err) => {
        console.log(err)
    })
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
