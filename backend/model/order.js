const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // Kiểu dữ liệu Array, lưu trữ thông tin về các sản phẩm trong giỏ hàng.
  cart: {
    type: Array,
    required: true,
  },
  //Kiểu dữ liệu Object, lưu trữ thông tin về địa chỉ giao hàng.
  shippingAddress: {
    type: Object,
    required: true,
  },
  //Kiểu dữ liệu Object, lưu trữ thông tin về người dùng đặt hàng.
  user: {
    type: Object,
    required: true,
  },
  //Kiểu dữ liệu Number, lưu trữ tổng giá trị đơn hàng.
  totalPrice: {
    type: Number,
    required: true,
  },
  //Kiểu dữ liệu String, lưu trữ trạng thái đơn hàng (mặc định là "Processing").
  status: {
    type: String,
    default: "Processing",
  },
  //Kiểu dữ liệu Object, lưu trữ thông tin về thanh toán.
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  // Kiểu dữ liệu Date, lưu trữ ngày giờ thanh toán (mặc định là ngày giờ hiện tại).
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  // Kiểu dữ liệu Date, lưu trữ ngày giờ giao hàng.
  deliveredAt: {
    type: Date,
  },
  //Kiểu dữ liệu Date, lưu trữ ngày giờ tạo đơn hàng (mặc định là ngày giờ hiện tại).
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
