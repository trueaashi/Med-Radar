const Doctor = require("../../models/Doctor");
const Hospital = require("../../models/Hospital");
const Image = require("../../models/Image");
const getDataUri = require("../../services/getDataUri");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");
const cloudinary = require("cloudinary");
const doctorControllers = {
  async addDoctor(req, res, next) {
    const { name, specialty, yearsOfExperience, startTime, endTime, about } =
      req.body;
    const hospitalId = req.__auth.id;
    const file = req.file;
    if (
      !name ||
      !specialty ||
      !yearsOfExperience ||
      !hospitalId ||
      !startTime ||
      !endTime ||
      !about
    ) {
      next(CustomErrorHandler.missingFields());
    }
    try {
      let image;
      if (file) {
        const fileUri = getDataUri(file);

        const cloudinaryUpload = await cloudinary.v2.uploader.upload(
          fileUri.content
        );

        image = await Image.create({
          public_id: cloudinaryUpload.public_id,
          url: cloudinaryUpload.secure_url,
        });
      }

      let doctor;
      if (image) {
        doctor = await Doctor.create({
          name,
          specialty,
          img: image._id,
          yearsOfExperience,
          startTime,
          endTime,
          about,
        });
      } else {
        doctor = await Doctor.create({
          name,
          specialty,
          yearsOfExperience,
          startTime,
          endTime,
          about,
        });
      }

      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }
      hospital.doctors.unshift(doctor._id);
      await hospital.save();
      res.status(200).json(`Dr.${name} added`);
    } catch (error) {
      return next(error);
    }
  },

  async updateImage(req, res, next) {
    const { doctorId } = req.params;
    const hospitalId = req.__auth.id;
    const file = req.file;
    if (!file || !doctorId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchDoctorId = hospital.doctors.find(
        (element) => element == doctorId
      );
      const isDoctorExist = searchDoctorId === doctorId;

      if (!isDoctorExist) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      const fileUri = getDataUri(file);
      const cloudinaryUpload = await cloudinaryUpload.v2.uploader.upload(
        fileUri.content
      );

      if (!doctor.img) {
        const image = await Image.create({
          public_id: cloudinaryUpload.public_id,
          url: cloudinaryUpload.secure_url,
        });
        doctor.img = image._id;
      } else {
        const image = await Image.findById(doctor.img);
        if (!image) {
          return next(CustomErrorHandler.notFound("Image not found"));
        }
        await cloudinary.v2.uploader.destroy(image.public_id);
        image.public_id = cloudinaryUpload.public_id;
        image.url = cloudinaryUpload.secure_url;
        await image.save();
      }

      await doctor.save();

      return res.status(200).json("Doctor's Image updated");
    } catch (error) {
      next(error);
    }
  },

  async getDoctors(req, res, next) {
    const hospitalId = req.__auth.id;
    if (!hospitalId) {
      next(CustomErrorHandler.missingFields());
    }
    try {
      const hospital = await Hospital.findById(hospitalId).populate("doctors");
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }
      res.status(200).json({ doctors: hospital.doctors });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  async getDoctor(req, res, next) {
    const hospitalId = req.__auth.id;
    const { id } = req.params;
    if (!hospitalId) {
      next(CustomErrorHandler.missingFields());
    }
    try {
      const hospital = await Hospital.findById(hospitalId).populate("doctors");
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }
      const doctor = await Doctor.findById(id).populate("img");
      if (!doctor) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }
      res.status(200).json({ doctor });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  async addAchievement(req, res, next) {
    const { doctorId } = req.params;
    const hospitalId = req.__auth.id;
    const { achievement } = req.body;
    if (!achievement || !doctorId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchDoctorId = hospital.doctors.find(
        (element) => element == doctorId
      );
      const isDoctorExist = searchDoctorId === doctorId;

      if (!isDoctorExist) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      doctor.achievements.unshift(achievement);
      await doctor.save();

      return res.status(200).json("achievements added");
    } catch (error) {
      next(error);
    }
  },
  async updateStartTime(req, res, next) {
    const { doctorId } = req.params;
    const hospitalId = req.__auth.id;
    const { newStartTime } = req.body;
    if (!newStartTime || !doctorId || !hospitalId)
      return next(CustomErrorHandler.missingFields());
    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }
      const searchDoctorId = hospital.doctors.find(
        (element) => element == doctorId
      );
      const isDoctorExist = searchDoctorId === doctorId;
      if (!isDoctorExist) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      doctor.startTime = newStartTime;
      await doctor.save();

      return res.status(200).json(`${doctor.name}'s start time updated`);
    } catch (error) {
      next(error);
    }
  },
  async updateEndTime(req, res, next) {
    const { doctorId } = req.params;
    const hospitalId = req.__auth.id;
    const { newEndTime } = req.body;
    if (!newStartTime || !doctorId || !hospitalId)
      return next(CustomErrorHandler.missingFields());
    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }
      const searchDoctorId = hospital.doctors.find(
        (element) => element == doctorId
      );
      const isDoctorExist = searchDoctorId === doctorId;
      if (!isDoctorExist) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      doctor.endTime = newEndTime;
      await doctor.save();

      return res.status(200).json(`${doctor.name}'s end time updated`);
    } catch (error) {
      next(error);
    }
  },
  async updateYOE(req, res, next) {
    const { doctorId } = req.params;
    const hospitalId = req.__auth.id;
    const { yearsOfExperience } = req.body;
    if (!yearsOfExperience || !doctorId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchDoctorId = hospital.doctors.find(
        (element) => element == doctorId
      );
      const isDoctorExist = searchDoctorId === doctorId;

      if (!isDoctorExist) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      doctor.yearsOfExperience = yearsOfExperience;
      await doctor.save();

      return res.status(200).json("years of Experience updated");
    } catch (error) {
      next(error);
    }
  },

  async updateName(req, res, next) {
    const { doctorId } = req.params;
    const hospitalId = req.__auth.id;
    const { name } = req.body;
    if (!name || !doctorId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchDoctorId = hospital.doctors.find(
        (element) => element == doctorId
      );
      const isDoctorExist = searchDoctorId === doctorId;

      if (!isDoctorExist) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      doctor.name = name;
      await doctor.save();

      return res.status(200).json("name updated");
    } catch (error) {
      next(error);
    }
  },

  async updateSpecialty(req, res, next) {
    const { doctorId } = req.params;
    const hospitalId = req.__auth.id;
    const { specialty } = req.body;
    if (!specialty || !doctorId || !hospitalId)
      return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const searchDoctorId = hospital.doctors.find(
        (element) => element == doctorId
      );
      const isDoctorExist = searchDoctorId === doctorId;

      if (!isDoctorExist) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return next(CustomErrorHandler.notFound("Doctor not Found"));
      }

      doctor.specialty = specialty;
      await doctor.save();

      return res.status(200).json("specialty updated");
    } catch (error) {
      next(error);
    }
  },
  async removeDoctor(req, res, next) {
    const hospitalId = req.__auth.id;
    const { id } = req.params;
    if (!hospitalId || !id) {
      next(CustomErrorHandler.missingFields());
    }
    try {
      const updated = await Hospital.updateOne(
        { _id: hospitalId },
        { $pull: { doctors: id } }
      );
      if (updated.modifiedCount !== 1) {
        return next(CustomErrorHandler.badRequest("Doctor didn't exist"));
      }
      const doctor = await Doctor.findById(id);
      const image = await Image.findById(doctor.img);
      if (!image) {
        return next(CustomErrorHandler.notFound("Image not found"));
      }
      await cloudinary.v2.uploader.destroy(image.public_id);
      await doctor.delete();
      res.status(200).json("successfully deleted");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = doctorControllers;
