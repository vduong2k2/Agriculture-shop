// tạo và lưu trữ token vào cookies khi đăng nhập thành công cho người dùng bán hàng.
const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    //Thời gian hết hạn của cookies, được thiết lập 90 ngày sau thời điểm hiện tại.
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //Giới hạn truy cập vào cookies bằng HTTP.
    httpOnly: true,
    //Chỉ cho phép gửi cookies khi các yêu cầu tới từ cùng một trang web.
    sameSite: "none",
    //Yêu cầu kết nối bảo mật (HTTPS) để gửi cookies.
    secure: true,
  };

  //tạo cookies với tên "seller_token", giá trị là token vừa tạo, và các tùy chọn đã được định nghĩa.
  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendShopToken;
