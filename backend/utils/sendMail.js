const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  //sử dụng phương thức createTransport của Nodemailer và cung cấp các thông tin cấu hình của SMTP server (host, port, service, authentication).
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  //thông tin cần thiết để gửi email, bao gồm địa chỉ email người gửi (from), địa chỉ email người nhận (to), chủ đề email (subject), và nội dung email (text).
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
