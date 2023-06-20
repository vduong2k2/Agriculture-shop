const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  //Kiểu dữ liệu String, yêu cầu nhập tên của sự kiện sản phẩm và không được để trống.
  name: {
    type: String,
    required: [true, "Please enter your event product name!"],
  },
  //Kiểu dữ liệu String, yêu cầu nhập mô tả cho sự kiện sản phẩm và không được để trống.
  description: {
    type: String,
    required: [true, "Please enter your event product description!"],
  },
  //Kiểu dữ liệu String, yêu cầu nhập danh mục cho sự kiện sản phẩm và không được để trống.
  category: {
    type: String,
    required: [true, "Please enter your event product category!"],
  },
  //Kiểu dữ liệu Date, yêu cầu nhập ngày bắt đầu của sự kiện sản phẩm.
  start_Date: {
    type: Date,
    required: true,
  },
  //Kiểu dữ liệu Date, yêu cầu nhập ngày kết thúc của sự kiện sản phẩm.
  Finish_Date: {
    type: Date,
    required: true,
  },
  //Kiểu dữ liệu String, giá trị mặc định là "Running" để đánh dấu sự kiện đang diễn ra.
  status: {
    type: String,
    default: "Running",
  },
  //Kiểu dữ liệu String, lưu trữ các từ khóa liên quan đến sự kiện sản phẩm.
  tags: {
    type: String,
  },
  // Kiểu dữ liệu Number, lưu trữ giá gốc của sản phẩm.
  originalPrice: {
    type: Number,
  },
  // Kiểu dữ liệu Number, yêu cầu nhập giá sản phẩm trong sự kiện và không được để trống.
  discountPrice: {
    type: Number,
    required: [true, "Please enter your event product price!"],
  },
  //Kiểu dữ liệu Number, yêu cầu nhập số lượng tồn kho của sản phẩm trong sự kiện và không được để trống.
  stock: {
    type: Number,
    required: [true, "Please enter your event product stock!"],
  },
  //Kiểu dữ liệu Array of Strings, lưu trữ đường dẫn của các hình ảnh liên quan đến sự kiện sản phẩm.
  images: [
    {
      type: String,
    },
  ],
  //Kiểu dữ liệu String, yêu cầu nhập ID của cửa hàng liên quan đến sự kiện sản phẩm.
  shopId: {
    type: String,
    required: true,
  },
  //Kiểu dữ liệu Object, yêu cầu nhập thông tin về cửa hàng liên quan đến sự kiện sản phẩm.
  shop: {
    type: Object,
    required: true,
  },
  //Kiểu dữ liệu Number, giá trị mặc định là 0, lưu trữ số lượng sản phẩm đã bán.
  sold_out: {
    type: Number,
    default: 0,
  },
  //Kiểu dữ liệu Date, lưu trữ ngày tạo sự kiện sản phẩm. Mặc định là ngày hiện tại.
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", eventSchema);
