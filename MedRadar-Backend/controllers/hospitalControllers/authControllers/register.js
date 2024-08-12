const HospitalDto = require("../../../dtos/hospitalDto");
const Hospital = require("../../../models/Hospital");
const Image = require("../../../models/Image");
const getDataUri = require("../../../services/getDataUri");
const hashServices = require("../../../services/hashServices");
const {
  createHospital,
} = require("../../../services/hospitalServices/createHospital");
const getHospitalServices = require("../../../services/hospitalServices/getHospitalServices");
const refreshHospitalServices = require("../../../services/hospitalServices/refreshHospitalServices");
const tokenServices = require("../../../services/tokenServices");
const CustomErrorHandler = require("../../../utils/CustomErrorHandler");
const cloudinary = require("cloudinary");
const registerController = {
  async register(req, res, next) {
    const { name, phone, pincode, state, city, location, email, password } =
      req.body;

    if (
      !name ||
      !pincode ||
      !phone ||
      !state ||
      !city ||
      !location ||
      !email ||
      !password
    ) {
      return next(CustomErrorHandler.missingFields());
    }

    try {
      const existHospital = await getHospitalServices.getByEmail(email);

      if (existHospital) {
        return next(
          CustomErrorHandler.alreadyExist("This email has been already taken")
        );
      }

      const hashedPassword = hashServices.hashPassword(password);
      const hospital = await createHospital(req.body, hashedPassword);

      const { accessToken, refreshToken } = tokenServices.generateTokens({
        _id: hospital._id,
        approved: hospital.approved,
      });

      await refreshHospitalServices.storeRefreshToken(
        refreshToken,
        hospital._id
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
      console.log(error);
      return next(error);
    }
  },
  async updateProfilePic(req, res, next) {
    const hospitalId = req.__auth.id;
    const file = req.file;
    if (!file || !hospitalId) return next(CustomErrorHandler.missingFields());

    try {
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return next(
          CustomErrorHandler.notFound("Hospital not found in our Database")
        );
      }

      const fileUri = getDataUri(file);

      if (!hospital.profilePic) {
        const cloudinaryUpload = await cloudinary.v2.uploader.upload(
          fileUri.content
        );
        const image = await Image.create({
          public_id: cloudinaryUpload.public_id,
          url: cloudinaryUpload.secure_url,
        });
        hospital.profilePic = image._id;
        await hospital.save();
      } else {
        const image = await Image.findById(hospital.profilePic);
        if (!image) {
          return next(CustomErrorHandler.notFound("Image not found"));
        }
        await cloudinary.v2.uploader.destroy(image.public_id);
        const cloudinaryUpload = await cloudinary.v2.uploader.upload(
          fileUri.content
        );
        image.public_id = cloudinaryUpload.public_id;
        image.url = cloudinaryUpload.secure_url;
        await image.save();
      }

      return res.status(200).json("Profile Image updated");
    } catch (error) {
      next(error);
    }
  },
};
module.exports = registerController;
