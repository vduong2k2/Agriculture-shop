const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

// create shop
// Xử lý yêu cầu POST để tạo cửa hàng mới. Nó sử dụng multer middleware để tải lên tệp hình ảnh của cửa hàng. Sau đó, nó kiểm tra xem có người dùng đã sử dụng địa chỉ email này để đăng ký cửa hàng trước đó chưa. Nếu có, nó trả về một lỗi. Nếu không, nó lưu thông tin cửa hàng (bao gồm hình ảnh) vào cơ sở dữ liệu và gửi một email chứa liên kết kích hoạt để người dùng kích hoạt cửa hàng.
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: fileUrl,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    const activationToken = createActivationToken(seller);

    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${seller.email} to activate your shop!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
// Tạo mã thông báo kích hoạt cho cửa hàng. Nó sử dụng thư viện jsonwebtoken để tạo mã thông báo dựa trên thông tin của cửa hàng và một khóa bí mật được cung cấp trong biến môi trường ACTIVATION_SECRET.
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
// Xử lý yêu cầu POST để kích hoạt cửa hàng. Nó nhận mã thông báo kích hoạt từ yêu cầu và xác thực mã thông báo đó. Nếu mã thông báo không hợp lệ, nó trả về một lỗi. Nếu hợp lệ, nó tạo một tài khoản cửa hàng mới trong cơ sở dữ liệu và gửi mã thông báo truy cập cho cửa hàng đó.
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login shop
// Xử lý yêu cầu POST để đăng nhập vào cửa hàng. Nó kiểm tra xem người dùng đã cung cấp đầy đủ thông tin đăng nhập chưa. Sau đó, nó tìm kiếm cửa hàng trong cơ sở dữ liệu dựa trên địa chỉ email và xác nhận mật khẩu. Nếu tìm thấy, nó gửi mã thông báo truy cập cho cửa hàng.
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load shop
// Xử lý yêu cầu GET để lấy thông tin về cửa hàng hiện tại. Nó sử dụng middleware isSeller để xác thực người dùng và trả về thông tin cửa hàng nếu xác thực thành công.
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
// Xử lý yêu cầu GET để đăng xuất khỏi cửa hàng. Nó xóa cookie chứa mã thông báo truy cập và trả về một thông báo thành công.
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
// Xử lý yêu cầu GET để lấy thông tin về một cửa hàng cụ thể dựa trên id của cửa hàng. Nó truy vấn cơ sở dữ liệu để tìm cửa hàng và trả về thông tin cửa hàng nếu tìm thấy.
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
// Xử lý yêu cầu PUT để cập nhật hình đại diện của cửa hàng. Nó sử dụng middleware isSeller để xác thực người dùng và multer middleware để tải lên tệp hình ảnh mới. Nó xóa hình đại diện cũ của cửa hàng, cập nhật đường dẫn mới và trả về thông tin cửa hàng sau khi cập nhật.
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await Shop.findById(req.seller._id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;

      fs.unlinkSync(existAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
// Xử lý yêu cầu PUT để cập nhật thông tin của cửa hàng. Nó sử dụng middleware isSeller để xác thực người dùng và cập nhật thông tin của cửa hàng trong cơ sở dữ liệu. Sau khi cập nhật thành công, nó trả về thông tin cửa hàng đã được cập nhật.
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
// Xử lý yêu cầu GET để lấy thông tin về tất cả các cửa hàng (dành cho quản trị viên). Nó sử dụng middleware isAuthenticated và isAdmin để xác thực quyền truy cập của người dùng và trả về thông tin về tất cả các cửa hàng.
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
// Xử lý yêu cầu DELETE để xóa một cửa hàng cụ thể (dành cho quản trị viên). Nó sử dụng middleware isAuthenticated và isAdmin để xác thực quyền truy cập của người dùng và xóa cửa hàng từ cơ sở dữ liệu.
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
// Xử lý yêu cầu PUT để cập nhật phương thức rút tiền của cửa hàng. Nó sử dụng middleware isSeller để xác thực người dùng và cập nhật phương thức rút tiền trong cơ sở dữ liệu.
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
// Xử lý yêu cầu DELETE để xóa phương thức rút tiền của cửa hàng (chỉ dành cho người bán hàng). Nó sử dụng middleware isSeller để xác thực người dùng và xóa phương thức rút tiền từ cửa hàng trong cơ sở dữ liệu.
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
