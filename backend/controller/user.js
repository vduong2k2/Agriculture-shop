const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Xử lý yêu cầu POST để tạo người dùng mới. Nó sử dụng middleware upload để tải lên tệp hình ảnh. Sau đó, nó kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa. Nếu người dùng đã tồn tại, nó sẽ xóa tệp hình ảnh vừa tải lên và trả về lỗi. Nếu người dùng chưa tồn tại, nó sẽ tạo một mã thông báo kích hoạt và gửi email xác nhận đến người dùng.
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
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

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
// Xử lý yêu cầu POST để kích hoạt người dùng sau khi nhận được mã thông báo kích hoạt. Nó xác thực mã thông báo, kiểm tra xem người dùng đã tồn tại chưa, và sau đó tạo người dùng mới trong cơ sở dữ liệu.
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
// Xử lý yêu cầu POST để xác thực người dùng khi đăng nhập. Nó kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không, sau đó so sánh mật khẩu được cung cấp với mật khẩu đã lưu trữ. Nếu thông tin đăng nhập hợp lệ, nó gửi mã thông báo truy cập đến người dùng.
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
//  Xử lý yêu cầu GET để lấy thông tin người dùng đã xác thực. Nó sử dụng middleware isAuthenticated để xác thực người dùng và trả về thông tin người dùng.
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
// Xử lý yêu cầu GET để đăng xuất người dùng. Nó xóa cookie chứa mã thông báo truy cập.
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
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

// update user info
// Xử lý yêu cầu PUT để cập nhật thông tin người dùng. Nó sử dụng middleware isAuthenticated để xác thực người dùng, sau đó cập nhật thông tin người dùng trong cơ sở dữ liệu.
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
// Xử lý yêu cầu PUT để cập nhật hình đại diện của người dùng. Nó sử dụng middleware isAuthenticated và upload để xác thực người dùng và tải lên tệp hình ảnh mới. Nó xóa hình đại diện cũ của người dùng, cập nhật đường dẫn mới và trả về thông tin người dùng sau khi cập nhật.
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;

      fs.unlinkSync(existAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
// Xử lý yêu cầu PUT để cập nhật địa chỉ của người dùng. Nó sử dụng middleware isAuthenticated để xác thực người dùng. Nếu địa chỉ cùng loại đã tồn tại, nó trả về lỗi. Nếu địa chỉ đã tồn tại, nó cập nhật thông tin địa chỉ. Nếu địa chỉ mới, nó thêm địa chỉ vào mảng địa chỉ của người dùng.
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
// Xử lý yêu cầu DELETE để xóa địa chỉ của người dùng. Nó sử dụng middleware isAuthenticated để xác thực người dùng và xóa địa chỉ dựa trên ID được cung cấp.
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      console.log(addressId);

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
// Xử lý yêu cầu PUT để cập nhật mật khẩu của người dùng. Nó sử dụng middleware isAuthenticated để xác thực người dùng và kiểm tra mật khẩu cũ. Nếu mật khẩu cũ không khớp hoặc mật khẩu mới không khớp với xác nhận mật khẩu, nó trả về lỗi. Nếu thông tin hợp lệ, nó cập nhật mật khẩu và trả về thông báo thành công.
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
// Xử lý yêu cầu GET để lấy thông tin người dùng dựa trên ID được cung cấp.
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
//  Xử lý yêu cầu GET để lấy danh sách tất cả người dùng. Nó sử dụng middleware isAuthenticated và isAdmin để xác thực và kiểm tra vai trò của người dùng. Nếu người dùng không phải là quản trị viên, nó trả về lỗi. Nếu người dùng là quản trị viên, nó trả về danh sách tất cả người dùng.
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
// Xử lý yêu cầu DELETE để xóa người dùng dựa trên ID được cung cấp. Nó sử dụng middleware isAuthenticated và isAdmin để xác thực và kiểm tra vai trò của người dùng. Nếu người dùng không phải là quản trị viên, nó trả về lỗi. Nếu người dùng là quản trị viên, nó xóa người dùng và trả về thông báo thành công.
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
