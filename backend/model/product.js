const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // Kiểu dữ liệu String, yêu cầu nhập tên sản phẩm.
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  // Kiểu dữ liệu String, yêu cầu nhập mô tả sản phẩm.
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  //Kiểu dữ liệu String, yêu cầu nhập danh mục sản phẩm.
  category: {
    type: String,
    required: [true, "Please enter your product category!"],
  },
  // Kiểu dữ liệu String, lưu trữ các từ khóa của sản phẩm.
  tags: {
    type: String,
  },
  //Kiểu dữ liệu Number, lưu trữ giá gốc của sản phẩm.
  originalPrice: {
    type: Number,
  },
  //Kiểu dữ liệu Number, yêu cầu nhập giá giảm của sản phẩm.
  discountPrice: {
    type: Number,
    required: [true, "Please enter your product price!"],
  },
  //Kiểu dữ liệu Number, yêu cầu nhập số lượng tồn kho của sản phẩm.
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  //Kiểu dữ liệu Array chứa các chuỗi (String), lưu trữ đường dẫn đến hình ảnh của sản phẩm.
  images: [
    {
      type: String,
    },
  ],
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  // Kiểu dữ liệu Number, lưu trữ điểm đánh giá trung bình của sản phẩm.
  ratings: {
    type: Number,
  },
  //Kiểu dữ liệu String, yêu cầu nhập ID của cửa hàng liên quan đến sản phẩm.
  shopId: {
    type: String,
    required: true,
  },
  //Kiểu dữ liệu Object, lưu trữ thông tin về cửa hàng liên quan đến sản phẩm.
  shop: {
    type: Object,
    required: true,
  },
  //Kiểu dữ liệu Number, lưu trữ số lượng đã bán của sản phẩm (mặc định là 0).
  sold_out: {
    type: Number,
    default: 0,
  },
  //Kiểu dữ liệu Date, lưu trữ ngày giờ tạo sản phẩm (mặc định là ngày giờ hiện tại).
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
