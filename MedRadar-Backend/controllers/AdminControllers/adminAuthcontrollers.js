const Admin = require("../../models/Admin");
const RefreshAdmin = require("../../models/RefreshAdmin");
const hashServices = require("../../services/hashServices");
const tokenServices = require("../../services/tokenServices");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");

const adminAuthControllers = {
  async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(CustomErrorHandler.missingFields());
    }
    const hashedPassword = hashServices.hashPassword(password);
    try {
      const admin = await Admin.findOne({ email: email });

      if (!admin) {
        return next(CustomErrorHandler.notFound("Invalid Email or Password"));
      }

      if (hashedPassword !== admin.password) {
        return next(CustomErrorHandler.notFound("Invalid Email or Password"));
      }

      const { accessToken, refreshToken } = tokenServices.generateTokens({
        _id: admin._id,
      });

      await RefreshAdmin.create({
        token: refreshToken,
        adminId: admin._id,
      });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
        sameSite: "none",
        secure: true,
      });

      res.status(200).json({
        message: "successfully Loggedin",
        isAuth: true,
        adminId: admin._id,
      });
    } catch (error) {
      return next(error);
    }
  },
  async refresh(req, res, next) {
    try {
      const { refreshToken: refreshTokenFromCookie } = req.cookies;

      if (!refreshTokenFromCookie) {
        next(CustomErrorHandler.unAuthorized());
      }

      let adminData = await tokenServices.verifyRefreshToken(
        refreshTokenFromCookie
      );

      let token = await RefreshAdmin.findOne({
        token: refreshTokenFromCookie,
        adminId: adminData._id,
      });

      if (!token) {
        return next(CustomErrorHandler.invalidToken());
      }

      const admin = await Admin.findById(adminData._id);
      if (!admin) {
        return next(CustomErrorHandler.notFound("No Admin exist with this id"));
      }

      const { refreshToken, accessToken } = tokenServices.generateTokens({
        _id: admin._id,
      });

      await RefreshAdmin.updateOne(
        { adminId: admin._id },
        { token: refreshToken }
      );

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
        sameSite: "none",
        secure: true,
      });

      res.status(200).json({
        message: "successfully Loggedin",
        isAuth: true,
        adminId: admin._id,
      });
    } catch (error) {
      next(error);
    }
  },
  async logout(req, res, next) {
    const { refreshToken } = req.cookies;
    // remove cookie from database
    await RefreshAdmin.deleteOne({ token: refreshToken });
    // delete cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json("logged out");
  },
};
module.exports = adminAuthControllers;
