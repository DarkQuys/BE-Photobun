const mongoose = require('mongoose')
const YourSchema = new mongoose.Schema({
  // Định nghĩa các trường dữ liệu phù hợp với bảng MySQL của bạn
  // Ví dụ:
  name: String,
  email: String,
  // Thêm các trường khác tương ứng với cấu trúc bảng MySQL
}, { 
  strict: false // Cho phép lưu các trường không được định nghĩa trong schema
});

// Tạo model

const Us = mongoose.model('Us', YourSchema);
module.exports= Us