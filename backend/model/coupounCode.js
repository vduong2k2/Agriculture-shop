const mongoose = require("mongoose");

const coupounCodeSchema = new mongoose.Schema({
  //Kiểu dữ liệu String, yêu cầu nhập tên của mã giảm giá (coupon code) và phải là duy nhất.
  name: {
    type: String,
    required: [true, "Please enter your coupoun code name!"],
    unique: true,
  },
  // Kiểu dữ liệu Number, yêu cầu nhập giá trị giảm giá.
  value: {
    type: Number,
    required: true,
  },
  // Kiểu dữ liệu Number, lưu trữ giá trị tối thiểu mà người dùng phải chi tiêu để áp dụng mã giảm giá.
  minAmount: {
    type: Number,
  },
  // Kiểu dữ liệu Number, lưu trữ giá trị tối đa mà mã giảm giá có thể giảm.
  maxAmount: {
    type: Number,
  },
  // Kiểu dữ liệu String, yêu cầu nhập ID của cửa hàng liên quan đến mã giảm giá.
  shopId: {
    type: String,
    required: true,
  },
  // Kiểu dữ liệu String, lưu trữ ID của sản phẩm cụ thể mà mã giảm giá áp dụng (nếu có).
  selectedProduct: {
    type: String,
  },
  //  Kiểu dữ liệu Date, lưu trữ ngày tạo mã giảm giá. Mặc định là ngày hiện tại.
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("CoupounCode", coupounCodeSchema);
