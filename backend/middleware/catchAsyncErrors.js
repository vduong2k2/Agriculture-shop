// đảm bảo rằng các lỗi bất đồng bộ không gây treo ứng dụng và cho phép xử lý lỗi một cách chính xác.
module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
