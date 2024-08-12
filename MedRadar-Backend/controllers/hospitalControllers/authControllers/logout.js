const refreshHospitalServices = require("../../../services/hospitalServices/refreshHospitalServices");

const logoutController = {
  async logout(req, res, next) {
    const { refreshToken } = req.cookies;
    // remove cookie from database
    await refreshHospitalServices.removeToken(refreshToken);
    // delete cookies
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json("logged out");
  },
};
module.exports = logoutController;
