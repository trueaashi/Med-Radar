const express = require("express");
const passport = require("passport");
const feedbackControllers = require("../controllers/userControllers/feedbackControllers");
const hospitalControllers = require("../controllers/userControllers/getHospitalControllers");
// const { userCheck } = require("../middlewares/auth");
const router = express.Router();

router.post("/hospitals", hospitalControllers.getAllHospitals);
router.get("/hospital/:id", hospitalControllers.getHospitalById);

// router.post("/feedback", feedbackControllers.giveFeedback);
// initial google ouath login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login",
  })
);

router.get("/login/sucess", async (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
});

// router.use(userCheck());

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

module.exports = router;
