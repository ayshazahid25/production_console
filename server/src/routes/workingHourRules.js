const express = require("express");
const { body, param } = require("express-validator");

const { protect } = require("../middleware/authMiddleware");
const {
  createWorkingHourRule,
  getAllWorkingHourRule,
  getWorkingHourRuleById,
  applyWorkingHourRule,
  removeWorkingHourRule,
} = require("../controllers/workingHourRules/workingHourRulesController");
const moment = require("moment");
const route = express.Router();

//create
route.post(
  "/",
  [
    body("working_hours_per_day")
      .isInt({ min: 1, max: 24 })
      .withMessage(
        "Working hours per day must be an integer between 1 and 24."
      ),
    body("break_time")
      .isFloat({ min: 0, max: 24 })
      .withMessage("Break hours per day must be an integer between 0 and 24."),
    body("number_of_working_days")
      .isInt({ min: 1, max: 7 })
      .withMessage(
        "Number of working days per week must be an integer between 1 and 7."
      ),
    body("checkin_time_start")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Check-in time start must be in HH:mm format.")
      .custom((value, { req }) => {
        const startTime = req.body.checkin_time_start;
        const endTime = req.body.checkin_time_end;

        if (!startTime || !endTime) {
          // If either start or end time is not provided, let other validators handle it
          return true;
        }

        const startMoment = moment(startTime, "HH:mm");
        const endMoment = moment(endTime, "HH:mm");

        if (startMoment.isBefore(endMoment)) {
          return true;
        }

        throw new Error(
          "Check-in time start must be before check-in time end."
        );
      }),
    body("checkin_time_end")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage("Check-in time end must be in HH:mm format."),
  ],
  protect,
  createWorkingHourRule
);

//get all working hour rules
route.get("/all", protect, getAllWorkingHourRule);

//get working hour rule by id
route.get(
  `/:id`,
  [
    param("id")
      .isMongoId()
      .withMessage("Please enter a valid working hour rule id"),
  ],
  protect,
  getWorkingHourRuleById
);

//working hour rule aplication
route.post(
  `/apply/:id`,
  [
    param("id")
      .isMongoId()
      .withMessage("Please enter a valid working hour rule id"),
  ],
  protect,
  applyWorkingHourRule
);

//working hour rule deletion
route.post(
  `/delete/:id`,
  [
    param("id")
      .isMongoId()
      .withMessage("Please enter a valid working hour rule id"),
  ],
  protect,
  removeWorkingHourRule
);

module.exports = route;
