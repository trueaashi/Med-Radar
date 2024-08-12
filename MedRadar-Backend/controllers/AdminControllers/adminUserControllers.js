const Feedback = require("../../models/Feedback");
const User = require("../../models/User");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");

const adminUserControllers = {
  async getUsers(req, res, next) {
    // let { banned } = req.body;
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  },
  async getUserById(req, res, next) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },
  async banOrUnbanUser(req, res, next) {
    const { id } = req.params;
    let { ban } = req.body;
    try {
      const user = await User.findById(id);
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }
      user.banned = ban;
      await user.save();
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },
  async getUserFeedbacks(req, res, next) {
    const { id } = req.params;
    const { hospitalId } = req.body;
    try {
      let feedbacks;
      if (hospitalId)
        feedbacks = await Feedback.find({ user: id, hospital: hospitalId });
      else feedbacks = await Feedback.find({ user: id });
      res.status(200).json({ feedbacks });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = adminUserControllers;
