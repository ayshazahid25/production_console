const { LeaveTypes } = require("../../models/leaveType");
const { WorkingHourRules } = require("../../models/workingHourRules");
const { ObjectId } = require("mongoose").Types;

//create leave type
const addleaveTypeMiddleware = async (leaveType) => {
  try {
    const result = await LeaveTypes.create([leaveType]);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//get all leave type
const getAllLeaveTypeMiddleware = async () => {
  return LeaveTypes.find()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// find and update leave type
const leaveTypeUpdation = async (id, leaveTypeData) => {
  return LeaveTypes.findOneAndUpdate({ _id: id }, leaveTypeData)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// get leave type by ID
const getleaveTypeIdMiddleware = async (getAllLeaveTypeMiddleware) => {
  const id = new ObjectId(getAllLeaveTypeMiddleware);
  return LeaveTypes.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "added_by",
        foreignField: "_id",
        as: "added_by",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "updated_by",
        foreignField: "_id",
        as: "updated_by",
      },
    },
    {
      $project: {
        added_by: {
          _id: 0,
          email: 0,
          is_admin: 0,
          password: 0,
          gender: 0,
          contract_durations: 0,
          joining_date: 0,
          createdAt: 0,
          updatedAt: 0,
        },
        updated_by: {
          _id: 0,
          email: 0,
          is_admin: 0,
          password: 0,
          gender: 0,
          contract_durations: 0,
          joining_date: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    },
  ])
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// find and remove rule
const removeLeaveTypeMiddleware = async (id) => {
  return LeaveTypes.findByIdAndDelete(id)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// find leave type by id
const findLeaveTypeById = async (id) => {
  return LeaveTypes.findById({ _id: id })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

module.exports = {
  addleaveTypeMiddleware,
  getAllLeaveTypeMiddleware,
  getleaveTypeIdMiddleware,
  leaveTypeUpdation,
  removeLeaveTypeMiddleware,
  findLeaveTypeById,
};
