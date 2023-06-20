const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema({
  //Kiểu dữ liệu String, yêu cầu nhập tên cửa hàng.
  name: {
    type: String,
    required: [true, "Please enter your shop name!"],
  },
  //Kiểu dữ liệu String, yêu cầu nhập địa chỉ email của cửa hàng.
  email: {
    type: String,
    required: [true, "Please enter your shop email address"],
  },
  //Kiểu dữ liệu String, yêu cầu nhập mật khẩu của cửa hàng. Giá trị này sẽ được băm (hash) trước khi lưu vào cơ sở dữ liệu.
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  //Kiểu dữ liệu String, lưu trữ mô tả về cửa hàng.
  description: {
    type: String,
  },
  // Kiểu dữ liệu String, yêu cầu nhập địa chỉ của cửa hàng.
  address: {
    type: String,
    required: true,
  },
  //Kiểu dữ liệu Number, yêu cầu nhập số điện thoại của cửa hàng.
  phoneNumber: {
    type: Number,
    required: true,
  },
  //Kiểu dữ liệu String, giá trị mặc định là "Seller" (Người bán).
  role: {
    type: String,
    default: "Seller",
  },
  //Kiểu dữ liệu String, yêu cầu nhập đường dẫn đến hình ảnh đại diện của cửa hàng.
  avatar: {
    type: String,
    required: true,
  },
  //Kiểu dữ liệu Number, yêu cầu nhập mã bưu chính của cửa hàng.
  zipCode: {
    type: Number,
    required: true,
  },
  //Kiểu dữ liệu Object, lưu trữ thông tin về phương thức rút tiền của cửa hàng.
  withdrawMethod: {
    type: Object,
  },
  //Kiểu dữ liệu Number, giá trị mặc định là 0, lưu trữ số dư hiện có của cửa hàng.
  availableBalance: {
    type: Number,
    default: 0,
  },
  //Kiểu dữ liệu Array, lưu trữ các giao dịch của cửa hàng.
  transections: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "Processing",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
    },
  ],
  //Kiểu dữ liệu Date, giá trị mặc định là ngày giờ hiện tại.
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  //Kiểu dữ liệu String, lưu trữ mã thông báo để khôi phục mật khẩu.
  resetPasswordToken: String,
  //Kiểu dữ liệu Date, lưu trữ ngày giờ tạo mã thông báo khôi phục mật khẩu.
  resetPasswordTime: Date,
});

// Hash password
//được sử dụng để thực thi mã trước khi cửa hàng được lưu vào cơ sở dữ liệu.
shopSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
//thêm vào đối tượng cửa hàng để tạo JWT token dựa trên ID của cửa hàng và JWT_SECRET_KEY (khóa bí mật) được cấu hình trong môi trường.
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// comapre password
//thêm vào đối tượng cửa hàng để so sánh mật khẩu đã nhập với mật khẩu đã lưu trong cơ sở dữ liệu.
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Shop", shopSchema);
