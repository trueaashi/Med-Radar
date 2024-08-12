const Hospital = require("../../models/Hospital");

const getHospitalControllers = {
  async getHospitalById(req, res, next) {
    const { id } = req.params;
    try {
      const hospitals = await Hospital.findById(id).populate(
        "treatments doctors feedbacks facilities specialties"
      );
      res.status(200).json({ hospitals });
    } catch (error) {
      next(error);
    }
  },
  async getAllHospitals(req, res, next) {
    const { name, treatment } = req.body;
    try {
      let hospitals;

      // Escaping function for regex
      const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (name) {
        const nameQuery = escapeRegex(name);
        const regexNamePattern = new RegExp(`^${nameQuery}`, "i");

        if (treatment) {
          const treatmentQuery = escapeRegex(treatment);
          const regexTreatmentPattern = new RegExp(`^${treatmentQuery}`, "i");

          hospitals = await Hospital.find({
            name: { $regex: regexNamePattern },
          }).populate({
            path: "treatments",
            match: { name: { $regex: regexTreatmentPattern } },
          });
        } else {
          hospitals = await Hospital.find({
            name: { $regex: regexNamePattern },
          });
        }
      } else if (treatment) {
        const treatmentQuery = escapeRegex(treatment);
        const regexTreatmentPattern = new RegExp(`^${treatmentQuery}`, "i");

        hospitals = await Hospital.find().populate({
          path: "treatments",
          match: { name: { $regex: regexTreatmentPattern } },
        });
      } else {
        hospitals = await Hospital.find();
      }

      // Optionally filter out hospitals with empty treatments if no matches
      if (treatment) {
        hospitals = hospitals.filter(
          (hospital) => hospital.treatments.length > 0
        );
      }

      res.status(200).json({ hospitals });
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
      next(error);
    }
  },
};
module.exports = getHospitalControllers;
