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
const {
  applyForLeave,
  getAllAppliedLeaves,
  getLeavesOfSpecificUser,
  getLeaveById,
  updateLeaveStatus,
} = require("../controllers/userLeave/userLeaveController");

const route = express.Router();

//create
route.post(
  "/",
  [
    body("leave_type")
      .isMongoId()
      .withMessage("Please enter a valid leave type id"),
    body("starting_date")
      .isISO8601({ strict: true })
      .withMessage("Please enter a valid ISO8601 format for starting date")
      .custom((value, { req }) => {
        const currentDate = new Date();
        const startDate = new Date(value);
        return startDate > currentDate;
      })
      .withMessage("Starting date must be after the current date"),
    body("ending_date")
      .isISO8601({ strict: true })
      .withMessage("Please enter a valid ISO8601 format for ending date")
      .custom((value, { req }) => {
        const startDate = new Date(req.body.starting_date);
        const endDate = new Date(value);
        return endDate > startDate;
      })
      .withMessage("Ending date must be after the starting date"),
    body("reason")
      .trim()
      .notEmpty()
      .withMessage("Reason is required and cannot be empty"),
  ],
  protect,
  applyForLeave
);

//get all applied levaes
route.get("/all", protect, getAllAppliedLeaves);

//get leaves of specific user
route.get(
  `/by_user/:id`,
  [param("id").isMongoId().withMessage("Please enter a valid user id")],
  protect,
  getLeavesOfSpecificUser
);

//get leaves details
route.get(
  `/leave/:id`,
  [param("id").isMongoId().withMessage("Please enter a valid leave id")],
  protect,
  getLeaveById
);

//update leave type
route.post(
  `/update_status/:id`,
  [
    param("id").isMongoId().withMessage("Please enter a valid leave id"),
    body("status")
      .isString()
      .notEmpty()
      .withMessage("Leave status type is required")
      .isIn(["approved", "cancle", "pending"])
      .withMessage("Invalid leave status type"),
  ],
  protect,
  updateLeaveStatus
);

module.exports = route;
