const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    // Kiểu dữ liệu String, lưu trữ ID của cuộc trò chuyện liên quan đến tin nhắn.
    conversationId: {
      type: String,
    },
    //Kiểu dữ liệu String, lưu trữ nội dung văn bản của tin nhắn.
    text: {
      type: String,
    },
    //Kiểu dữ liệu String, lưu trữ thông tin người gửi tin nhắn.
    sender: {
      type: String,
    },
    // Kiểu dữ liệu String, lưu trữ đường dẫn đến hình ảnh liên quan đến tin nhắn (nếu có).
    images: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messagesSchema);
