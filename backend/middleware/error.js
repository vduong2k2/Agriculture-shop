const ErrorHandler = require("../utils/ErrorHandler");
// sử dụng để xử lý các lỗi xảy ra trong ứng dụng.
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // wrong mongodb id error
  // Nếu lỗi là "CastError" (lỗi khi chuyển đổi kiểu dữ liệu trong MongoDB), thì tạo một đối tượng lỗi mới với thông báo lỗi tương ứng và mã trạng thái 400 (Bad Request).
  if (err.name === "CastError") {
    const message = `Resources not found with this id.. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  // Nếu lỗi là lỗi trùng lặp khóa (duplicate key error) trong MongoDB, thì tạo một đối tượng lỗi mới với thông báo lỗi tương ứng và mã trạng thái 400.
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  // Nếu lỗi là "JsonWebTokenError" (lỗi xác thực JWT không hợp lệ), thì tạo một đối tượng lỗi mới với thông báo lỗi tương ứng và mã trạng thái 400.
  if (err.name === "JsonWebTokenError") {
    const message = `Your url is invalid please try again letter`;
    err = new ErrorHandler(message, 400);
  }

  // jwt expired
  // Nếu lỗi là "TokenExpiredError" (lỗi JWT đã hết hạn), thì tạo một đối tượng lỗi mới với thông báo lỗi tương ứng và mã trạng thái 400.
  if (err.name === "TokenExpiredError") {
    const message = `Your Url is expired please try again letter!`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
