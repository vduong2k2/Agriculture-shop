const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    //  Kiểu dữ liệu String, lưu trữ tiêu đề của nhóm trò chuyện.
    groupTitle: {
      type: String,
    },
    //  Kiểu dữ liệu Array, lưu trữ danh sách các thành viên trong nhóm trò chuyện.
    members: {
      type: Array,
    },
    // Kiểu dữ liệu String, lưu trữ nội dung của tin nhắn cuối cùng trong nhóm trò chuyện.
    lastMessage: {
      type: String,
    },
    // Kiểu dữ liệu String, lưu trữ ID của tin nhắn cuối cùng trong nhóm trò chuyện.
    lastMessageId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
