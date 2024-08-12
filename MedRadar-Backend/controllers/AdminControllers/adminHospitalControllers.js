const Hospital = require("../../models/Hospital");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");

const adminHospitalControllers = {
  async getHospitals(req, res, next) {
    const { approved } = req.body;
    try {
      const hospitals = await Hospital.find({ approved: approved });
      res.status(200).json({ hospitals });
    } catch (error) {
      console.log(error);
    }
  },

  async approveHospital(req, res, next) {
    const { id } = req.params;
    const { approve } = req.body;
    try {
      const hospital = await Hospital.findById(id);
      if (!hospital)
        return next(CustomErrorHandler.notFound("Hospital Not Found!"));
      hospital.approved = approve;
      await hospital.save();
      res.status(200).json({ hospital });
    } catch (error) {
      console.log(error);
    }
  },
  
  async getHospitalById(req, res, next) {
    const { id } = req.params;
    try {
      const hospital = await Hospital.findById(id);
      if (!hospital)
        return next(CustomErrorHandler.notFound("Hospital Not Found!"));
      res.status(200).json({ hospital });
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = adminHospitalControllers;
