const { titleCase } = require("title-case");
const { customException } = require("../../middleware/commonMiddleware");
const { Users } = require("../../models/user");
const { ObjectId } = require("mongoose").Types;

// find user with email address
const findUser = async (email) => {
  try {
    const user = await Users.aggregate([
      {
        $match: { email: email, is_active: true },
      },
      {
        $addFields: {
          contractExpired: {
            $cond: {
              if: {
                $ne: [
                  {
                    $arrayElemAt: ["$contract_durations.employment_type", -1],
                  },
                  "permanent",
                ],
              },
              then: {
                $cond: {
                  if: {
                    $lte: [
                      new Date(),
                      {
                        $ifNull: [
                          {
                            $arrayElemAt: ["$contract_durations.end_date", -1],
                          },
                          new Date(),
                        ],
                      },
                    ],
                  },
                  then: false,
                  else: true,
                },
              },
              else: false,
            },
          },
        },
      },
    ]);

    if (!user || user.length === 0) {
      throw new Error("No user found!");
    }

    // Check if the contract has expired
    if (user[0].contractExpired) {
      throw new Error("Contract expired. Please renew your contract.");
    }

    // Return the user without the added field
    return { ...user[0], contractExpired: undefined };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserByUniqueValues = async (user, userExistid) => {
  let checkUnique = {
    $or: [
      { email: user.email },
      user.cnic && { cnic: user.cnic }, // Only include CNIC if it exists
      user.phone_number && { phone_number: user.phone_number }, // Only include Phone Number if it exists
    ].filter(Boolean), // Filter out null/undefined values
  };

  let whereStatement;
  if (userExistid) {
    whereStatement = {
      $and: [{ _id: { $ne: userExistid } }, checkUnique],
    };
  } else {
    whereStatement = checkUnique;
  }

  try {
    const result = await Users.findOne(whereStatement);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//create user
const addUserMiddleware = async (userDetails) => {
  try {
    const result = await Users.create([userDetails]);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Send mesage to db
const getUserById = async (userId) => {
  try {
    const todayStart = new Date(); // Get the current date
    todayStart.setHours(0, 0, 0, 0); // Set the time to the start of the day

    const id = new ObjectId(userId);
    const user = await Users.aggregate([
      {
        $match: {
          _id: id,
          is_active: true,
        },
      },
      {
        $addFields: {
          contractExpired: {
            $cond: {
              if: {
                $ne: [
                  {
                    $arrayElemAt: ["$contract_durations.employment_type", -1],
                  },
                  "permanent",
                ],
              },
              then: {
                $cond: {
                  if: {
                    $lte: [
                      new Date(),
                      {
                        $ifNull: [
                          {
                            $arrayElemAt: ["$contract_durations.end_date", -1],
                          },
                          new Date(),
                        ],
                      },
                    ],
                  },
                  then: false,
                  else: true,
                },
              },
              else: false,
            },
          },
        },
      },
      //get last check data
      {
        $lookup: {
          from: "checkins",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user", "$$userId"] },
              },
            },
          ],
          as: "lastCheckIn",
        },
      },

      {
        $unwind: { path: "$lastCheckIn", preserveNullAndEmptyArrays: true }, // Unwind the lastCheckIn array
      },
      {
        $sort: { "lastCheckIn.updatedAt": -1 }, // Sort checkins by timestamp in descending order
      },
      {
        $group: {
          _id: "$_id", // Group by user ID
          user: { $first: "$$ROOT" }, // Keep the first document (latest checkin)
        },
      },
      {
        $replaceRoot: { newRoot: "$user" }, // Replace the root with the user document
      },

      //get todays data too
      {
        $lookup: {
          from: "checkins",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $gte: ["$createdAt", todayStart] },
                  ],
                },
              },
            },
          ],
          as: "todayCheckIn",
        },
      },
      {
        $unwind: { path: "$todayCheckIn", preserveNullAndEmptyArrays: true }, // Unwind the todayCheckIn array
      },
      {
        $sort: { "todayCheckIn.createdAt": 1 }, // Sort checkins by timestamp in descending order
      },
      {
        $group: {
          _id: "$_id", // Group by user ID
          user: { $first: "$$ROOT" }, // Keep the first document (latest checkin)
        },
      },
      {
        $replaceRoot: { newRoot: "$user" }, // Replace the root with the user document
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);
    if (!user || user.length === 0) {
      throw new Error("No user found!");
    }

    // Check if the contract has expired
    if (user[0].contractExpired) {
      throw new Error("Contract expired. Please renew your contract.");
    }

    // Return the user without the added field
    return { ...user[0], contractExpired: undefined };
  } catch (error) {
    throw new Error(error.message);
  }
};

// get all users
const getAllusersMiddleware = async (loggedInUserId) => {
  const id = new ObjectId(loggedInUserId);
  return Users.aggregate([
    {
      $match: {
        _id: { $ne: id },
      },
    },

    {
      $project: {
        password: 0,
      },
    },
    {
      $sort: {
        createdAt: -1, //Sort by Date Added DESC
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

// get all active users
const getActiveUsersMiddleware = async (loggedInUserId) => {
  const id = new ObjectId(loggedInUserId);
  return Users.aggregate([
    {
      $match: {
        $and: [{ _id: { $ne: id } }, { is_active: { $eq: true } }],
      },
    },

    {
      $project: {
        password: 0,
      },
    },
    {
      $sort: {
        createdAt: -1, //Sort by Date Added DESC
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

// get user by ID
const getUserByIdWithDetailMiddleware = async (userId) => {
  const id = new ObjectId(userId);
  return Users.aggregate([
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
        password: 0,
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

// find user by id
const findUserById = async (arrayOfIds) => {
  return Users.find({ _id: { $in: arrayOfIds } })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

//get array of users to change status
const userIdsToDelete = (usersExistsByIds, id) => {
  const userIds = [];
  usersExistsByIds.map((user) => {
    if (user.is_admin || user.id === id) {
      throw customException(
        `${
          usersExistsByIds.length > 1
            ? `You are not allowed to perform this action. Please de-select "${titleCase(
                user.first_name
              )} ${titleCase(user.last_name)}" and try again.`
            : `You are not allowed to perform this action on "${titleCase(
                user.first_name
              )} ${titleCase(user.last_name)}".`
        }`,
        400
      );
    }
    userIds.push(user.id);
  });
  return userIds;
};

// find and update user
const usersUpdation = async (objectIds, userDetail) => {
  return Users.updateMany(
    { _id: { $in: objectIds } },
    { $set: userDetail },
    {
      runValidators: true,
      context: "query",
    }
  )
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const userUpdation = async (id, userData) => {
  return Users.findOneAndUpdate({ _id: id }, userData, {
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// Function to count total active employees
const countActiveEmployees = async () => {
  const activeEmployees = await Users.countDocuments({ is_active: true });
  return activeEmployees;
};

module.exports = {
  findUser,
  getUserByUniqueValues,
  addUserMiddleware,
  getUserById,
  getAllusersMiddleware,
  getActiveUsersMiddleware,
  getUserByIdWithDetailMiddleware,
  findUserById,
  userIdsToDelete,
  userUpdation,
  usersUpdation,
  countActiveEmployees,
};
