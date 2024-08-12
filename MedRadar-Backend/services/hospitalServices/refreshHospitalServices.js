const RefreshHospital = require("../../models/RefreshHospital");

class RefreshHospitalServices {
  async storeRefreshToken(token, hospitalId) {
    await RefreshHospital.create({
      token: token,
      hospitalId: hospitalId,
    });
  }
  async findRefreshToken(hospitaId, refreshToken) {
    const token = await RefreshHospital.findOne({
      hospitaId: hospitaId,
      token: refreshToken,
    });
    return token;
  }
  async updateRefreshToken(hospitaId, refershToken) {
    return await RefreshHospital.updateOne(
      { hospitaId: hospitaId },
      { token: refershToken }
    );
  }
  async removeToken(refreshToken) {
    return await RefreshHospital.deleteOne({ token: refreshToken });
  }
}
module.exports = new RefreshHospitalServices();
