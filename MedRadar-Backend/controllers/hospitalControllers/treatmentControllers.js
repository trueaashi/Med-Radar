const Hospital = require("../../models/Hospital");
const Treatment = require("../../models/Treatment");
const getHospitalServices = require("../../services/hospitalServices/getHospitalServices");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");
const treatmentControllers = {
  async getTreatmentById(req, res, next) {
    const { id } = req.params;
    try {
      const treatment = await Treatment.findById(id);
      if (!treatment) {
        return next(CustomErrorHandler.notFound("Treatment not found"));
      }
      res.status(200).json({ treatment });
    } catch (error) {
      next(error);
    }
  },
  async addTreatment(req, res, next) {
    try {
      const { name, description, price, duration } = req.body;
      const hospitalId = req.__auth.id;
      const hospital = await getHospitalServices.getById(hospitalId);
      if (!hospital)
        return next(CustomErrorHandler.notFound("Hospital not found"));

      const treatment = await Treatment.create({
        name,
        description,
        price,
        duration,
      });

      hospital.treatments.push(treatment._id);
      await hospital.save();
      res.status(200).json("Treatment details successfully added.");
    } catch (error) {
      next(error);
    }
  },
  async getTreatments(req, res, next) {
    const hospitalId = req.__auth.id;
    if (!hospitalId) {
      next(CustomErrorHandler.missingFields());
    }
    try {
      const hospital = await Hospital.findById(hospitalId).populate(
        "treatments"
      );
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }
      res.status(200).json({ treatments: hospital.treatments });
    } catch (error) {
      next(error);
    }
  },

  async removeTreatment(req, res, next) {
    const hospitalId = req.__auth.id;
    const { id } = req.params;
    if (!hospitalId || !id) {
      next(CustomErrorHandler.missingFields());
    }
    try {
      const updated = await Hospital.updateOne(
        { _id: hospitalId },
        { $pull: { treatments: id } }
      );
      if (updated.modifiedCount !== 1) {
        return next(CustomErrorHandler.badRequest("Treatment didn't exist"));
      }
      await Treatment.findByIdAndDelete(id);
      res.status(200).json("treatment deleted");
    } catch (error) {
      next(error);
    }
  },

  async updateDescription(req, res, next) {
    const { treatmentId } = req.params;
    const hospitalId = req.__auth.id;
    const { description } = req.body;
    if (!description || !treatmentId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchTreatmentId = hospital.treatments.find(
        (element) => element == treatmentId
      );
      const isTreatmentExist = searchTreatmentId === treatmentId;

      if (!isTreatmentExist) {
        return next(CustomErrorHandler.notFound("Treatment not Found"));
      }

      const treatment = await Treatment.findById(treatmentId);
      if (!treatment) {
        return next(CustomErrorHandler.notFound("Treatment not Found"));
      }

      treatment.description = description;
      await treatment.save();

      return res.status(200).json("treatment description updated");
    } catch (error) {
      next(error);
    }
  },

  async updatePrice(req, res, next) {
    const { treatmentId } = req.params;
    const hospitalId = req.__auth.id;
    const { price } = req.body;
    if (!price || !treatmentId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchTreatmentId = hospital.treatments.find(
        (element) => element == treatmentId
      );
      const isTreatmentExist = searchTreatmentId === treatmentId;

      if (!isTreatmentExist) {
        return next(CustomErrorHandler.notFound("Treatment not Found"));
      }

      const treatment = await Treatment.findById(treatmentId);
      if (!treatment) {
        return next(CustomErrorHandler.notFound("Treatment not Found"));
      }

      treatment.price = Number(price);
      await treatment.save();

      return res.status(200).json("treatment price updated");
    } catch (error) {
      next(error);
    }
  },

  async updateName(req, res, next) {
    const { treatmentId } = req.params;
    const hospitalId = req.__auth.id;
    const { name } = req.body;
    if (!name || !treatmentId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchTreatmentId = hospital.treatments.find(
        (element) => element == treatmentId
      );
      const isTreatmentExist = searchTreatmentId === treatmentId;

      if (!isTreatmentExist) {
        return next(CustomErrorHandler.notFound("Treatment not Found"));
      }

      const treatment = await Treatment.findById(treatmentId);
      if (!treatment) {
        return next(CustomErrorHandler.notFound("Treatment not Found"));
      }

      treatment.name = name;
      await treatment.save();

      return res.status(200).json("treatment name updated");
    } catch (error) {
      next(error);
    }
  },

  async updateDuration(req, res, next) {
    const { treatmentId } = req.params;
    const hospitalId = req.__auth.id;
    const { duration } = req.body;
    if (!duration || !treatmentId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchTreatmentId = hospital.treatments.find(
        (element) => element == treatmentId
      );
      const isTreatmentExist = searchTreatmentId === treatmentId;

      if (!isTreatmentExist) {
        return next(CustomErrorHandler.notFound("Treatment not Found"));
      }

      const treatment = await Treatment.findById(treatmentId);
      if (!treatment) {
        return next(CustomErrorHandler.notFound("Treatment not Found"));
      }

      treatment.duration = duration;
      await treatment.save();

      return res.status(200).json("treatment duration updated");
    } catch (error) {
      next(error);
    }
  },
  async updateTreatment(req, res, next) {
    const { id } = req.params;
    try {
      const { name, description, price, duration } = req.body;
      const hospitalId = req.__auth.id;
      const hospital = await getHospitalServices.getById(hospitalId);
      if (!hospital)
        return next(CustomErrorHandler.notFound("Hospital not found"));

      const treatment = await Treatment.findById(id);
      if (!treatment)
        return next(CustomErrorHandler.notFound("Treatment not found"));

      treatment.name = name;
      treatment.description = description;
      treatment.price = price;
      treatment.duration = duration;

      await treatment.save();
      res.status(200).json("Treatment details successfully Updated.");
    } catch (error) {
      next(error);
    }
  },
};
module.exports = treatmentControllers;
