const asyncHandler = require("express-async-handler");
const { expressValidatorError } = require("../../middleware/commonMiddleware");
const {
  validateUserLeaves,
  validateUpdateLeaveStatus,
} = require("../../models/userLeave");
const { findLeaveTypeById } = require("../leaveType/leaveTypeHelper");
const {
  applyForLeaveMiddleware,
  getAllAppliedLeavesMiddleware,
  getLeavesOfSpecificUserMiddleware,
  getLeaveByIdMiddleware,
  findUserLeaveById,
  updateLeaveStatusMiddleware,
} = require("./userLeaveHelper");

// @desc apply for leave
// @route POST /api/user_leave
// @access Public
const applyForLeave = asyncHandler(async (req, res) => {
  //validate requested data
  expressValidatorError(req);

  if (
    req.result.contract_durations[req.result.contract_durations.length - 1]
      .employment_type === "probation" ||
    req.result.contract_durations[req.result.contract_durations.length - 1]
      .employment_type === "internship"
  ) {
    res.status(400);
    throw new Error("You are not eligibal to apply for leave");
  }

  const userLeave = req.body;
  userLeave.user = req.result._id.toString();

  if (userLeave) {
    const { error } = validateUserLeaves(userLeave);

    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
  }

  try {
    // Find the leave type by ID
    const leaveType = await findLeaveTypeById(userLeave.leave_type);

    if (!leaveType) {
      res.status(400);
      throw new Error("Leave type don't exist");
    }

    // Check if the leave type is applicable to the user's gender
    if (leaveType.gender !== "both" && leaveType.gender !== req.result.gender) {
      res.status(400);
      throw new Error("You are not eligible to apply for this leave type.");
    }

    // Calculate the number of days between starting and ending dates
    const startDate = new Date(userLeave.starting_date);
    const endDate = new Date(userLeave.ending_date);
    const numberOfDays = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    // Check if the requested number of days exceeds the allowed limit
    if (numberOfDays > leaveType.leave_days_per_year) {
      res.status(400);
      throw new Error(
        "Requested leave duration exceeds the maximum allowed days for this leave type."
      );
    }

    //now user can apply for leave
    const appliedForLeave = await applyForLeaveMiddleware(userLeave);

    if (!appliedForLeave) {
      res.status(400);
      throw new Error("Unable to apply for leave!");
    }

    res.status(200).json({ message: "Leave applied successfully!" });
  } catch (error) {
    res.status(
      error.statusCode
        ? error.statusCode
        : res.statusCode
        ? res.statusCode
        : 500
    );
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? "Something went wrong while applying for leave: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get all user applied leaves
// @route GET /api/user_leave/all
// @access Private
const getAllAppliedLeaves = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    //get all applied leaves
    const appliedLeaves = await getAllAppliedLeavesMiddleware();

    if (!appliedLeaves) {
      res.status(400);
      throw new Error("No leave found!");
    }

    res.status(200).json({
      appliedLeaves,
    });
  } catch (error) {
    res.status(
      error.statusCode
        ? error.statusCode
        : res.statusCode
        ? res.statusCode
        : 500
    );
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? "Something went wrong while fetching leaves: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get leaves of specific user
// @route GET /api/user_leave/by_user/:id
// @access Private
const getLeavesOfSpecificUser = asyncHandler(async (req, res) => {
  if (!req.result.is_admin && req.params.id !== req.result._id.toString()) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);
  try {
    //find only one user with their leaves
    const userLeaves = await getLeavesOfSpecificUserMiddleware(req.params.id);

    if (!userLeaves || userLeaves.length === 0) {
      res.status(400);
      throw new Error("User haven't applied for leaves yet");
    }

    res.status(200).json({
      userLeaves,
    });
  } catch (error) {
    res.status(
      error.statusCode
        ? error.statusCode
        : res.statusCode
        ? res.statusCode
        : 500
    );
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? "Something went wrong while user's leaves: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get leave by id
// @route GET /api/user_leave/leave/:id
// @access Private
const getLeaveById = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);
  try {
    //find only one user with their leaves
    const leaveDetails = await getLeaveByIdMiddleware(req.params.id);

    if (!leaveDetails || leaveDetails.length === 0) {
      res.status(400);
      throw new Error("Leave not found!");
    }

    res.status(200).json({
      leaveDetails,
    });
  } catch (error) {
    res.status(
      error.statusCode
        ? error.statusCode
        : res.statusCode
        ? res.statusCode
        : 500
    );
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? "Something went wrong while fetching leave details: "
          : ""
      }${error.message}`
    );
  }
});

// @desc update leave status
// @route GET /api/user_leave/update_status/:id
// @access Private
const updateLeaveStatus = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);

  const userLeave = req.body;
  userLeave.approved_by = req.result._id.toString();

  // validate userLeave
  if (userLeave) {
    const { error } = validateUpdateLeaveStatus(userLeave);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
  }

  try {
    // check if user leave exist with param id
    const userLeaveExist = await findUserLeaveById(req.params.id);

    if (!userLeaveExist) {
      res.status(400);
      throw new Error("No leave found");
    }

    //check if leave type exist with param id
    const userLeaveUpdated = await updateLeaveStatusMiddleware(
      req.params.id,
      userLeave
    );

    if (!userLeaveUpdated) {
      res.status(400);
      throw new Error("Leave status could not be updated.");
    }

    return res
      .status(200)
      .json({ message: "Leave status updated successfully!" });
  } catch (error) {
    res.status(
      error.statusCode
        ? error.statusCode
        : res.statusCode
        ? res.statusCode
        : 500
    );
    throw new Error(
      `${
        error.statusCode !== 400 && res.statusCode !== 400
          ? `Something went wrong while updating leave status: `
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  applyForLeave,
  getAllAppliedLeaves,
  getLeavesOfSpecificUser,
  getLeaveById,
  updateLeaveStatus,
};
