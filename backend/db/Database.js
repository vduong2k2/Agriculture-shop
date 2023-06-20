const mongoose = require("mongoose");

//  Hàm để kết nối với cơ sở dữ liệu MongoDB. Nó sử dụng phương thức mongoose.connect để thiết lập kết nối với cơ sở dữ liệu MongoDB sử dụng URL cung cấp trong biến môi trường DB_URL. Hàm này cũng cung cấp một số tùy chọn cấu hình như useNewUrlParser và useUnifiedTopology. Sau khi kết nối thành công, nó in ra thông báo "mongod connected with server" và tên host của kết nối.
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
