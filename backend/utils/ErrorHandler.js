class ErrorHandler extends Error {
  //Lớp ErrorHandler được sử dụng để tạo ra các đối tượng lỗi với thông báo và mã trạng thái cụ thể.
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;
