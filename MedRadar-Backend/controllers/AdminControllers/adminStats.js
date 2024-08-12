const Admin = require("../../models/Admin");
const Hospital = require("../../models/Hospital");
const User = require("../../models/User");
const hashServices = require("../../services/hashServices");

const adminStats = {
  async getStats(req, res, next) {
    try {
      const approvedHospitalscount = await Hospital.countDocuments({
        approved: true,
      });
      const usersCount = await User.countDocuments({ banned: false });
      const unApprovedHospitalsCount = await Hospital.countDocuments({
        approved: false,
      });
      res
        .status(200)
        .json({ approvedHospitalscount, usersCount, unApprovedHospitalsCount });
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    const hashedPassword = hashServices.hashPassword("admin0");

    await Admin.create({
      email: "admin0@gmail.com",
      password: hashedPassword,
    });

    // const approvedHospitalscount = await Hospital.countDocuments({
    //   approved: true,
    // });
    // const usersCount = await User.countDocuments({ banned: false });
    // const unApprovedHospitalsCount = await Hospital.countDocuments({
    //   approved: false,
    // });
    res.status(200);
    // .json({ approvedHospitalscount, usersCount, unApprovedHospitalsCount });
  },
};
module.exports = adminStats;
