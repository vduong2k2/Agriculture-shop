const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  //Kiểu dữ liệu String, yêu cầu nhập tên người dùng.
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  // Kiểu dữ liệu String, yêu cầu nhập địa chỉ email của người dùng.
  email: {
    type: String,
    required: [true, "Please enter your email!"],
  },
  //Kiểu dữ liệu String, yêu cầu nhập mật khẩu của người dùng. Giá trị này sẽ được băm (hash) trước khi lưu vào cơ sở dữ liệu.
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  //Kiểu dữ liệu Number, lưu trữ số điện thoại của người dùng (không bắt buộc).
  phoneNumber: {
    type: Number,
  },
  //Kiểu dữ liệu Array, lưu trữ địa chỉ của người dùng.
  addresses: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    },
  ],
  //Kiểu dữ liệu String, giá trị mặc định là "user" (người dùng).
  role: {
    type: String,
    default: "user",
  },
  //Kiểu dữ liệu String, yêu cầu nhập đường dẫn đến hình ảnh đại diện của người dùng.
  avatar: {
    type: String,
    required: true,
  },
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

//  Hash password
//sử dụng để thực thi mã trước khi người dùng được lưu vào cơ sở dữ liệu.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
//thêm vào đối tượng người dùng để tạo JWT token dựa trên ID của người dùng và JWT_SECRET_KEY (khóa bí mật) được cấu hình trong môi trường.
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// compare password
//thêm vào đối tượng người dùng để so sánh mật khẩu đã nhập với mật khẩu đã lưu trong cơ sở dữ liệu.
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
