const CustomErrorHandler = require("../utils/CustomErrorHandler");
const tokenServices = require("../services/tokenServices");
const Admin = require("../models/Admin");
const Hospital = require("../models/Hospital");
const User = require("../models/User");
async function jwtVerification(req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return next(CustomErrorHandler.invalidToken());
    }
    const token = await tokenServices.verifyAccessToken(accessToken);
    if (!token) {
      return next(CustomErrorHandler.invalidToken());
    }
    if (await Hospital.findOne({ _id: token._id })) {
      req.__auth = {
        role: "hospital",
        id: token._id,
      };
    } else if (await Admin.findOne({ _id: token._id })) {
      req.__auth = {
        role: "admin",
        id: token._id,
      };
    } else {
      next(CustomErrorHandler.unAuthorized("Invalid authentication token"));
      return;
    }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      next(CustomErrorHandler.unAuthorized(err.name + ": " + err.message));
      return;
    } else if (err.name === "JsonWebToken" && err.message === "invalid token") {
      next(CustomErrorHandler.unAuthorized(err.name + ": " + err.message));
      return;
    } else {
      next(CustomErrorHandler.serverError(err.name + ": " + err.message));
      return;
    }
  }
}

function checkAdminRole(req, res, next) {
  if (req.__auth.role !== "admin") {
    next(CustomErrorHandler.unAuthorized("Not a 'Admin'! "));
    return;
  }
  next();
}

function checkHospitalRole(req, res, next) {
  if (req.__auth.role !== "hospital") {
    next(CustomErrorHandler.unAuthorized("Not a 'Hospital'! "));
    return;
  }
  next();
}

const authMiddleware = {
  jwtAuth: jwtVerification,
  adminCheck: checkAdminRole,
  hospitalCheck: checkHospitalRole,
};

module.exports = authMiddleware;
