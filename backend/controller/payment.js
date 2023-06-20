const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Route handler xử lý yêu cầu POST để tạo một phiên thanh toán mới. Nó sử dụng Stripe để tạo một đối tượng Payment Intent với số tiền và thông tin khác từ yêu cầu. Sau đó, nó trả về một đối tượng Payment Intent với mã xác thực của khách hàng.
router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Becodemy",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);
// Route handler xử lý yêu cầu GET để trả về khóa API của Stripe từ biến môi trường STRIPE_API_KEY.
router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
