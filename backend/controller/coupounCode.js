const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

// create coupoun code
// Route handler xử lý yêu cầu POST để tạo mã giảm giá mới. Trước khi tạo, nó kiểm tra xem mã giảm giá đã tồn tại hay chưa. Nếu đã tồn tại, nó trả về một lỗi. Nếu chưa tồn tại, nó tạo mã giảm giá mới và trả về kết quả thành công.
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isCoupounCodeExists = await CoupounCode.find({
        name: req.body.name,
      });

      if (isCoupounCodeExists.length !== 0) {
        return next(new ErrorHandler("Coupoun code already exists!", 400));
      }

      const coupounCode = await CoupounCode.create(req.body);

      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all coupons of a shop
// Route handler xử lý yêu cầu GET để lấy danh sách mã giảm giá của một cửa hàng cụ thể. Nó truy vấn và trả về danh sách mã giảm giá của cửa hàng.
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await CoupounCode.find({ shopId: req.seller.id });
      res.status(201).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete coupoun code of a shop
// Route handler xử lý yêu cầu DELETE để xóa một mã giảm giá của một cửa hàng. Nếu mã giảm giá không tồn tại, nó trả về một lỗi. Nếu tồn tại, nó xóa mã giảm giá và trả về thông báo thành công.
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code dosen't exists!", 400));
      }
      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get coupon code value by its name
// Route handler xử lý yêu cầu GET để lấy giá trị của một mã giảm giá dựa trên tên của nó. Nó truy vấn và trả về giá trị của mã giảm giá.
router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
