const { startAndEndOfDay } = require("../../middleware/commonMiddleware");
const { UserLeaves } = require("../../models/userLeave");
const { ObjectId } = require("mongoose").Types;

//create user
const applyForLeaveMiddleware = async (userLeave) => {
  try {
    const result = await UserLeaves.create([userLeave]);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//get all applied leaves
const getAllAppliedLeavesMiddleware = async () => {
  try {
    const groupedLeaves = await UserLeaves.aggregate([
      {
        $lookup: {
          from: "leavetypes",
          localField: "leave_type",
          foreignField: "_id",
          as: "leave_type",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "applied_by",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "approved_by",
          foreignField: "_id",
          as: "approved_by",
        },
      },

      {
        $project: {
          starting_date: 1,
          ending_date: 1,
          reason: 1,
          status: 1,
          leave_type: {
            leave_type_title: 1,
            leave_description: 1,
            leave_days_per_year: 1,
            gender: 1,
          },
          applied_by: {
            first_name: 1,
            last_name: 1,
            title: 1,
          },
          approved_by: {
            first_name: 1,
            last_name: 1,
          },
          days_applied: {
            $divide: [
              { $subtract: ["$ending_date", "$starting_date"] },
              1000 * 60 * 60 * 24, // Convert milliseconds to days
            ],
          },
        },
      },
      {
        $group: {
          _id: "$status",
          leaves: { $push: "$$ROOT" },
        },
      },
    ]);

    return groupedLeaves;
  } catch (error) {
    throw new Error(error);
  }
};

//get all applied leaves by specific user
const getLeavesOfSpecificUserMiddleware = async (userId) => {
  const id = new ObjectId(userId);
  try {
    const userLeaves = await UserLeaves.aggregate([
      {
        $match: {
          user: id,
        },
      },
      {
        $lookup: {
          from: "leavetypes",
          localField: "leave_type",
          foreignField: "_id",
          as: "leave_type",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "applied_by",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "approved_by",
          foreignField: "_id",
          as: "approved_by",
        },
      },

      {
        $project: {
          starting_date: 1,
          ending_date: 1,
          reason: 1,
          status: 1,
          leave_type: {
            leave_type_title: 1,
            leave_description: 1,
            leave_days_per_year: 1,
            gender: 1,
          },
          applied_by: {
            first_name: 1,
            last_name: 1,
            title: 1,
          },
          approved_by: {
            first_name: 1,
            last_name: 1,
          },
          days_applied: {
            $divide: [
              { $subtract: ["$ending_date", "$starting_date"] },
              1000 * 60 * 60 * 24, // Convert milliseconds to days
            ],
          },
        },
      },
      {
        $group: {
          _id: "$status",
          leaves: { $push: "$$ROOT" },
        },
      },
    ]);

    return userLeaves;
  } catch (error) {
    throw new Error(error);
  }
};

//get leave details
const getLeaveByIdMiddleware = async (leaveId) => {
  const id = new ObjectId(leaveId);
  try {
    const leaveDetails = await UserLeaves.aggregate([
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: "leavetypes",
          localField: "leave_type",
          foreignField: "_id",
          as: "leave_type",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "applied_by",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "approved_by",
          foreignField: "_id",
          as: "approved_by",
        },
      },

      {
        $project: {
          starting_date: 1,
          ending_date: 1,
          reason: 1,
          status: 1,
          leave_type: {
            leave_type_title: 1,
            leave_description: 1,
            leave_days_per_year: 1,
            gender: 1,
          },
          applied_by: {
            first_name: 1,
            last_name: 1,
            title: 1,
          },
          approved_by: {
            first_name: 1,
            last_name: 1,
          },
          days_applied: {
            $divide: [
              { $subtract: ["$ending_date", "$starting_date"] },
              1000 * 60 * 60 * 24, // Convert milliseconds to days
            ],
          },
        },
      },
    ]);

    return leaveDetails;
  } catch (error) {
    throw new Error(error);
  }
};

// find user leave by id
const findUserLeaveById = async (id) => {
  return UserLeaves.findById({ _id: id })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// find and update leave status
const updateLeaveStatusMiddleware = async (id, leaveTypeData) => {
  return UserLeaves.findOneAndUpdate({ _id: id }, leaveTypeData)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

//get today's users on leave
const getTodayUsersOnLeave = async () => {
  const { startOfDay, endOfDay } = startAndEndOfDay();

  return UserLeaves.countDocuments({
    status: "approved",
    starting_date: {
      $lte: endOfDay,
    },
    ending_date: {
      $gte: startOfDay,
    },
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
module.exports = {
  applyForLeaveMiddleware,
  getAllAppliedLeavesMiddleware,
  getLeavesOfSpecificUserMiddleware,
  getLeaveByIdMiddleware,
  findUserLeaveById,
  updateLeaveStatusMiddleware,
  getTodayUsersOnLeave,
};
