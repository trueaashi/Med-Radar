const Feedback = require("../../models/Feedback");
const Hospital = require("../../models/Hospital");
const CustomErrorHandler = require("../../utils/CustomErrorHandler");

const feedbackControllers = {
  async giveFeedback(req, res, next) {
    const { id } = req.params;
    const { feedback } = req.body;
    const userId = req.__auth.id;
    if (!feedback || !userId) {
      return next(CustomErrorHandler.missingFields());
    }
    try {
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return next(CustomErrorHandler.notFound("Hospital not found"));
      }

      const feedbackData = await Feedback.create({
        user: userId,
        hospital: hospital._id,
        feedback,
      });

      hospital.feedbacks.push(feedbackData._id);
      await hospital.save();
      res.status(200).json(`Your feedback is submitted successfully`);
    } catch (error) {
      next(error);
    }
  },
  async deleteFeedback(req, res, next) {
    const { id } = req.params;
    const userId = req.__auth.id;
    try {
      const feedback = await Feedback.findOne({ user: userId, hospital: id });

      if (!feedback)
        return next(CustomErrorHandler.notFound("Feedback not found"));

      const updatedHospital = await Hospital.updateOne(
        { _id: id },
        { $pull: { feedbacks: feedback._id } }
      );

      await feedback.delete();
      res.status(200).json(`Your feedback is deleted successfully`);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = feedbackControllers;
