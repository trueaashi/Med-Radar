const express = require("express");
const router = express.Router();

const loginController = require("../controllers/hospitalControllers/authControllers/login");
const registerController = require("../controllers/hospitalControllers/authControllers/register");
const logoutController = require("../controllers/hospitalControllers/authControllers/logout");
const refreshController = require("../controllers/hospitalControllers/authControllers/refresh");
const treatmentControllers = require("../controllers/hospitalControllers/treatmentControllers");
const specialtiesControllers = require("../controllers/hospitalControllers/specialtiesControllers");
const facilitiesControllers = require("../controllers/hospitalControllers/facilitiesControllers");
const doctorControllers = require("../controllers/hospitalControllers/doctorControllers");
const auth = require("../middlewares/auth");
const singleUpload = require("../middlewares/multer");

// [+] Auth routes
router.post("/signup", registerController.register);
router.post("/signin", loginController.login);
router.post("/signout", logoutController.logout);

router.use(auth.jwtAuth);
router.use(auth.hospitalCheck);


router.get("/refresh", refreshController.refresh);
router.get("/me", refreshController.getHospital);
router.put("/profile-pic", singleUpload, registerController.updateProfilePic);

// [+] Treatment
router.post("/treatments", treatmentControllers.addTreatment);
router.delete("/treatment/:id", treatmentControllers.removeTreatment);
router.get("/treatments", treatmentControllers.getTreatments);
router.get("/treatment/:id", treatmentControllers.getTreatmentById);
router.put("/treatment/:id", treatmentControllers.updateTreatment);

// [+] Specialties
router.post("/specialties", specialtiesControllers.addSpecialties);
router.put("/specialties", specialtiesControllers.removeSpecialties);

// [+] Facilities
router.post("/facility", singleUpload,facilitiesControllers.addFacilities);
router.delete("/facility/:id", facilitiesControllers.removeFacilities);
router.get("/facilities", facilitiesControllers.getAllFacilities);

// [+] doctors
router.post("/doctor", singleUpload, doctorControllers.addDoctor);
router.put("/doctors-img", singleUpload, doctorControllers.updateImage);
router.get("/doctors", doctorControllers.getDoctors);
router.delete("/doctor/:id", doctorControllers.removeDoctor);
router.get("/doctor/:id", doctorControllers.getDoctor);

module.exports = router;
