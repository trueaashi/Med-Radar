const Facility = require("../../models/Facility");
const Hospital = require("../../models/Hospital");
const Image = require("../../models/Image");
const getDataUri = require("../../services/getDataUri");
const getHospitalServices = require("../../services/hospitalServices/getHospitalServices");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");
const cloudinary = require("cloudinary");
const facilitiesControllers = {
  async addFacilities(req, res, next) {
    const { facility } = req.body;
    const hospitalId = req.__auth.id;
    const file = req.file;
    if (!file || !facility) return next(CustomErrorHandler.missingFields());
    try {
      const hospital = await getHospitalServices.getById(hospitalId);
      if (!hospital) {
        next(CustomErrorHandler.notFound("Hospital not Found"));
      }

      const fileUri = getDataUri(file);

      const cloudinaryUpload = await cloudinary.v2.uploader.upload(
        fileUri.content
      );

      const image = await Image.create({
        public_id: cloudinaryUpload.public_id,
        url: cloudinaryUpload.secure_url,
      });

      const facilityCreated = await Facility.create({
        name: facility,
        img: image._id,
      });

      hospital.facilities.push(facilityCreated._id);
      await hospital.save();

      res.status(200).json(`Facility added successfully`);
    } catch (error) {
      next(error);
    }
  },
  async removeFacilities(req, res, next) {
    try {
      const { id } = req.params;
      const hospitalId = req.__auth.id;
      const hospital = await getHospitalServices.getById(hospitalId);
      if (!hospital) {
        next(CustomErrorHandler.notFound("Hospital not Found"));
      }

      const facility = await Facility.findById(id).populate("img");
      if (!facility)
        return next(CustomErrorHandler.notFound("facility not found"));

      await Image.findByIdAndDelete(facility.img._id);
      await cloudinary.v2.uploader.destroy(facility.img.public_id);
      await facility.delete();

      res
        .status(200)
        .json(`${facility.name} has been removed from your facilities list`);
    } catch (error) {
      next(error);
    }
  },
  async getAllFacilities(req, res, next) {
    try {
      const hospitalId = req.__auth.id;
      const hospital = await Hospital.findById(hospitalId).populate({
        path: "facilities", // First level of population: the facilities field.
        populate: {
          path: "img", // Second level of population: the img field inside each facility.
          model: "Image", // Assuming 'Image' is the model name for images; adjust as necessary.
        },
      });
      if (!hospital) {
        next(CustomErrorHandler.notFound("Hospital not Found"));
      }

      res.status(200).json({ facilities: hospital.facilities });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = facilitiesControllers;
