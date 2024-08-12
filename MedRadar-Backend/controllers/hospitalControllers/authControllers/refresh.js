const HospitalDto = require("../../../dtos/hospitalDto");
const Hospital = require("../../../models/Hospital");
const getHospitalServices = require("../../../services/hospitalServices/getHospitalServices");
const refreshHospitalServices = require("../../../services/hospitalServices/refreshHospitalServices");
const tokenServices = require("../../../services/tokenServices");
const CustomErrorHandler = require("../../../utils/CustomErrorHandler");

const refreshController = {
  async refresh(req, res, next) {
    try {
      const { refreshToken: refreshTokenFromCookie } = req.cookies;
      if (!refreshTokenFromCookie) {
        next(CustomErrorHandler.unAuthorized());
      }

      let hospitalData = await tokenServices.verifyRefreshToken(
        refreshTokenFromCookie
      );
      let token = await refreshHospitalServices.findRefreshToken(
        hospitalData._id,
        refreshTokenFromCookie
      );
      if (!token) {
        return next(CustomErrorHandler.invalidToken());
      }

      const hospital = await Hospital.findById(hospitalData._id).populate(
        "profilePic"
      );
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("No hospital exist with this id")
        );
      }

      const { refreshToken, accessToken } = tokenServices.generateTokens({
        _id: hospital._id,
        approved: hospital.approved,
      });

      await refreshHospitalServices.updateRefreshToken(
        hospital._id,
        refreshToken
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

      const hospitalDto = new HospitalDto(hospital);

      res.status(200).json({
        error: false,
        message: "successfully Loggedin",
        success: true,
        data: {
          isAuth: true,
          hospital: hospitalDto,
          approved: hospital.approved,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  async getHospital(req, res, next) {
    const hospitalId = req.__auth.id;
    try {
      const hospital = await Hospital.findById(hospitalId).populate(
        "profilePic"
      );
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("No hospital exist with this id")
        );
      }
      const hospitalDto = new HospitalDto(hospital);

      res.status(200).json({
        success: true,
        hospital: hospitalDto,
      });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = refreshController;
