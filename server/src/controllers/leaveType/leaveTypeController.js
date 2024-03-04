const asyncHandler = require("express-async-handler");

const { expressValidatorError } = require("../../middleware/commonMiddleware");

const { validateLeaveType } = require("../../models/leaveType");
const {
  addleaveTypeMiddleware,
  getleaveTypeIdMiddleware,
  leaveTypeUpdation,
  removeLeaveTypeMiddleware,
  getAllLeaveTypeMiddleware,
  findLeaveTypeById,
} = require("./leaveTypeHelper");

// @desc Create leave type
// @route POST /api/leave_type
// @access Public
const createLeaveType = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  //validate requested data
  expressValidatorError(req);
  const leaveType = req.body;

  try {
    leaveType.added_by = req.result._id.toString();

    if (leaveType) {
      const { error } = validateLeaveType(leaveType);

      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
    }

    //insert into db
    const leaveTypeCreated = await addleaveTypeMiddleware(leaveType);

    if (!leaveTypeCreated) {
      res.status(400);
      throw new Error("Unable to create leave type");
    }

    return res.status(200).json({ message: "Leave type created successfully" });
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
          ? "Something went wrong while creating leave type: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get all leave types
// @route GET /api/leave_type/all
// @access Private
const getAllLeaveType = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    //get all leaveTypes
    const leaveTypes = await getAllLeaveTypeMiddleware();

    if (!leaveTypes) {
      res.status(400);
      throw new Error("No leave type found!");
    }

    res.status(200).json({
      leaveTypes,
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
          ? "Something went wrong while fetching leave types: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get leave type by id
// @route GET /api/working_hour_rules/:id
// @access Private
const getLeaveTypeById = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);

  try {
    const leaveType = await getleaveTypeIdMiddleware(req.params.id);

    if (!leaveType || leaveType.length === 0) {
      res.status(400);
      throw new Error("Leave type don't exist");
    }

    res.status(200).json({
      leaveType,
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
          ? "Something went wrong while fetching leave type data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc update leave type
// @route POST /api/leave_type/update/:id
// @access Private
const upadteLeaveType = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);

  const leavetype = req.body;
  leavetype.updated_by = req.result._id.toString();

  // validate leavetype
  if (leavetype) {
    const { error } = validateLeaveType(leavetype);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
  }

  try {
    // check if leave type exist with param id
    const leaveTypeExist = await findLeaveTypeById(req.params.id);

    if (!leaveTypeExist) {
      res.status(400);
      throw new Error("Leave type don't exist");
    }

    //check if leave type exist with param id
    const leaveTypeUpdated = await leaveTypeUpdation(req.params.id, leavetype);

    if (!leaveTypeUpdated) {
      res.status(400);
      throw new Error("Leave type could not be updated.");
    }

    return res
      .status(200)
      .json({ message: "Leave type updated successfully!" });
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
          ? `Something went wrong while updating leave type: `
          : ""
      }${error.message}`
    );
  }
});

// @desc remove leave type
// @route POST /api/leave_type/delete/:id
// @access Private
const removeLeaveType = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);

  try {
    //remove rule with sepecific id
    const removedLeaveType = await removeLeaveTypeMiddleware(req.params.id);
    if (!removedLeaveType) {
      res.status(400);
      throw new Error("Unbale to delete leave type.");
    }

    return res
      .status(200)
      .json({ message: "Leave type deleted successfully!" });
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
          ? `Something went wrong while deleting leave type: `
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createLeaveType,
  getAllLeaveType,
  getLeaveTypeById,
  upadteLeaveType,
  removeLeaveType,
};
