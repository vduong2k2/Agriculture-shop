const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");

// create product
// Route handler xử lý yêu cầu POST để tạo một sản phẩm mới. Nó sử dụng middleware upload để xử lý việc tải lên hình ảnh sản phẩm và lưu trữ các tệp tin được tải lên vào thư mục uploads. Sau đó, nó tạo một đối tượng sản phẩm mới từ dữ liệu yêu cầu và lưu nó vào cơ sở dữ liệu. Cuối cùng, nó trả về đối tượng sản phẩm được tạo.
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);

        const productData = req.body;
        productData.images = imageUrls;
        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
// Route handler xử lý yêu cầu GET để lấy danh sách sản phẩm của một cửa hàng cụ thể dựa trên id của cửa hàng. Nó truy vấn cơ sở dữ liệu để tìm các sản phẩm thuộc về cửa hàng có id được cung cấp và trả về danh sách các sản phẩm đó.
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
// Route handler xử lý yêu cầu DELETE để xóa một sản phẩm thuộc về cửa hàng dựa trên id của sản phẩm. Nó truy vấn cơ sở dữ liệu để tìm sản phẩm có id được cung cấp, xóa tệp hình ảnh liên quan và xóa sản phẩm khỏi cơ sở dữ liệu. Nếu sản phẩm không tồn tại, nó trả về một lỗi.
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const productData = await Product.findById(productId);

      productData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
// Route handler xử lý yêu cầu GET để lấy danh sách tất cả sản phẩm. Nó truy vấn cơ sở dữ liệu để tìm các sản phẩm và trả về danh sách các sản phẩm đó theo thứ tự ngược lại của thời gian tạo.
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
// Route handler xử lý yêu cầu PUT để tạo một đánh giá mới cho sản phẩm. Nó lấy thông tin đánh giá từ yêu cầu và tìm sản phẩm tương ứng. Nếu người dùng đã đánh giá sản phẩm trước đó, nó cập nhật đánh giá hiện có. Nếu không, nó thêm đánh giá mới vào danh sách đánh giá của sản phẩm.
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
// Route handler xử lý yêu cầu GET để lấy danh sách tất cả sản phẩm. Nó chỉ cho phép người dùng có vai trò quản trị viên truy cập vào tác vụ này. Nếu người dùng không phải là quản trị viên, nó sẽ trả về một lỗi.
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
