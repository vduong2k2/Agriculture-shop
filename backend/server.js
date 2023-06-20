const app = require("./app");
const connectDatabase = require("./db/Database");

// Handling uncaught Exception
//Nếu có một ngoại lệ không được bắt và xử lý, chúng ta in ra thông báo lỗi và tắt server.
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
//Đọc các biến môi trường từ tệp .env nếu không phải là môi trường PRODUCTION.
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// connect db
connectDatabase();

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
