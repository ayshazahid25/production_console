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
