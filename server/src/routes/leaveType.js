const express = require("express");
const { body, param } = require("express-validator");

const { protect } = require("../middleware/authMiddleware");
const {
  createLeaveType,
  getAllLeaveType,
  getLeaveTypeById,
  upadteLeaveType,
  removeLeaveType,
} = require("../controllers/leaveType/leaveTypeController");

const route = express.Router();

//create
route.post(
  "/",
  [
    body("leave_type_title")
      .isString()
      .notEmpty()
      .withMessage("Please enter a leave type title"),
    body("leave_description")
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage("Please enter a valid leave type description"),
    body("leave_days_per_year")
      .isNumeric()
      .isInt({ min: 1, max: 365 })
      .withMessage(
        "Number of leaves per year must be an integer between 1 and 365."
      ),
    body("gender")
      .isString()
      .optional({ checkFalsy: true, nullable: true })
      .isIn(["male", "female", "both"])
      .withMessage("Enter right gender type."),
  ],
  protect,
  createLeaveType
);

//get all leave types
route.get("/all", protect, getAllLeaveType);

//get leave type by id
route.get(
  `/:id`,
  [param("id").isMongoId().withMessage("Please enter a valid leave type id")],
  protect,
  getLeaveTypeById
);

//update leave type
route.post(
  `/update/:id`,
  [param("id").isMongoId().withMessage("Please enter a valid leave type id")],
  protect,
  upadteLeaveType
);

//leave type deletion
route.post(
  `/delete/:id`,
  [param("id").isMongoId().withMessage("Please enter a valid leave type id")],
  protect,
  removeLeaveType
);

module.exports = route;
