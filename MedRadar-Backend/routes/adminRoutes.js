const express = require("express");
const auth = require("../middlewares/auth");
const adminUserControllers = require("../controllers/AdminControllers/adminUserControllers");
const adminStats = require("../controllers/AdminControllers/adminStats");
const adminAuthControllers = require("../controllers/AdminControllers/adminAuthcontrollers");
const adminHospitalControllers = require("../controllers/AdminControllers/adminHospitalControllers");
const router = express.Router();

// Auth admin
router.post("/login", adminAuthControllers.login);
router.get("/refresh", adminAuthControllers.refresh);
router.post("/logout", adminAuthControllers.logout);

router.get("/createAdmin", adminStats.create);

// router.use( auth.jwtAuth )
// router.use( auth.adminCheck )

//Admin Stats
router.get("/stats", adminStats.getStats);

// Admin user routes
router.post("/users", adminUserControllers.getUsers);
router.get("/user/:id", adminUserControllers.getUserById);
router.put("/user/:id", adminUserControllers.banOrUnbanUser);
router.get("/feedbacks/:id", adminUserControllers.getUserFeedbacks);

// Admin hospital controllers
router.post("/hospitals", adminHospitalControllers.getHospitals);
router.get("/hospital/:id", adminHospitalControllers.getHospitalById);
router.put("/approve/:id", adminHospitalControllers.approveHospital);

module.exports = router;
