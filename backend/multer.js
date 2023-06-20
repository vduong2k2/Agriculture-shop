const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  //Đường dẫn đến thư mục đích để lưu trữ các tệp tin đã tải lên.
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, "./uploads"));
  },
  // Hàm này được sử dụng để đặt tên cho tệp tin được tải lên.
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    cb(null, filename + "-" + uniqueSuffix + ".png");
  },
});

exports.upload = multer({ storage: storage });
