const getHospitalServices = require("../../services/hospitalServices/getHospitalServices");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");

const specialtiesControllers = {
  async addSpecialties(req, res, next) {
    try {
      const { specialties } = req.body;
      const hospitalId = req.__auth.id;
      const hospital = await getHospitalServices.getById(hospitalId);
      if (!hospital) {
        next(CustomErrorHandler.notFound("Hospital not Found"));
      }

      if (hospital.specialties.length === 0) {
        hospital.specialties = specialties;
        await hospital.save();
      } else {
        const existingSpecialties = hospital.specialties;
        const updatedSpecialties = [...existingSpecialties, ...specialties];
        hospital.specialties = updatedSpecialties;
        await hospital.save();
      }
      const message = specialties.length === 0 ? "Specialty" : "Specialties";
      res.status(200).json(`${message} updated`);
    } catch (error) {
      next(error);
    }
  },

  async removeSpecialties(req, res, next) {
    try {
      const { specialty } = req.body;
      const hospitalId = req.__auth.id;
      const hospital = await getHospitalServices.getById(hospitalId);
      if (!hospital) {
        next(CustomErrorHandler.notFound("Hospital not Found"));
      }

      const existingSpecialties = hospital.specialties;
      const filteredSpecialties = existingSpecialties.filter(
        (fac) => fac !== facility
      );
      hospital.specialties = filteredSpecialties;
      await hospital.save();

      res
        .status(200)
        .json(`${specialty} has been removed from your specialties list`);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = specialtiesControllers;
