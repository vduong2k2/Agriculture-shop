const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  //Kiểu dữ liệu Object, yêu cầu nhập thông tin người bán.
  seller: {
    type: Object,
    required: true,
  },
  //Kiểu dữ liệu Number, yêu cầu nhập số tiền rút.
  amount: {
    type: Number,
    required: true,
  },
  //Kiểu dữ liệu String, giá trị mặc định là "Processing" (đang xử lý).
  status: {
    type: String,
    default: "Processing",
  },
  //Kiểu dữ liệu Date, giá trị mặc định là ngày giờ hiện tại.
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  //Kiểu dữ liệu Date, lưu trữ ngày giờ cập nhật.
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Withdraw", withdrawSchema);
