const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request --- only for seller
// Xử lý yêu cầu POST để tạo yêu cầu rút tiền. Nó sử dụng middleware isSeller để xác thực người bán. Sau đó, nó gửi email thông báo cho người bán rằng yêu cầu rút tiền của họ đang được xử lý. Sau đó, nó tạo một yêu cầu rút tiền mới trong cơ sở dữ liệu và cập nhật số dư có sẵn trong cửa hàng của người bán. Cuối cùng, nó trả về kết quả thành công và thông tin về yêu cầu rút tiền.
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;

      const data = {
        seller: req.seller,
        amount,
      };

      try {
        await sendMail({
          email: req.seller.email,
          subject: "Withdraw Request",
          message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3days to 7days to processing! `,
        });
        res.status(201).json({
          success: true,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }

      const withdraw = await Withdraw.create(data);

      const shop = await Shop.findById(req.seller._id);

      shop.availableBalance = shop.availableBalance - amount;

      await shop.save();

      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all withdraws --- admnin
// Xử lý yêu cầu GET để lấy danh sách tất cả các yêu cầu rút tiền. Nó sử dụng middleware isAuthenticated và isAdmin để xác thực và kiểm tra vai trò của người dùng. Nếu người dùng không phải là quản trị viên, nó trả về lỗi. Nếu người dùng là quản trị viên, nó lấy danh sách các yêu cầu rút tiền từ cơ sở dữ liệu và trả về kết quả thành công cùng với danh sách yêu cầu rút tiền.
router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw request ---- admin
// Xử lý yêu cầu PUT để cập nhật yêu cầu rút tiền. Nó sử dụng middleware isAuthenticated và isAdmin để xác thực và kiểm tra vai trò của người dùng. Nếu người dùng không phải là quản trị viên, nó trả về lỗi. Nếu người dùng là quản trị viên, nó cập nhật trạng thái của yêu cầu rút tiền và thời gian cập nhật trong cơ sở dữ liệu. Sau đó, nó cập nhật thông tin giao dịch của người bán và gửi email thông báo cho người bán rằng yêu cầu rút tiền của họ đang được xử lý. Cuối cùng, nó trả về kết quả thành công và thông tin về yêu cầu rút tiền đã được cập nhật.
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId } = req.body;

      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transections = [...seller.transections, transection];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
