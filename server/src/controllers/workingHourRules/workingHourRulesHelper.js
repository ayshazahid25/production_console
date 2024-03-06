const {
  convertStringTimeToDateTime,
} = require("../../middleware/commonMiddleware");
const { WorkingHourRules } = require("../../models/workingHourRules");
const { ObjectId } = require("mongoose").Types;

//create working hour rule
const addWorkingHourRulesMiddleware = async (rules) => {
  try {
    const result = await WorkingHourRules.create([rules]);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//get all working hour rules
const getAllWorkingHourRuleMiddleware = async () => {
  return WorkingHourRules.find()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

//get applied rule
const getAppliedWorkingHourRuleMiddleware = async () => {
  return WorkingHourRules.find({ applied: true })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// get working hour rule by ID
const getWorkingHourRuleIdMiddleware = async (ruleId) => {
  const id = new ObjectId(ruleId);
  return WorkingHourRules.aggregate([
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

// find and disable rule
const disableWorkingHourRules = async (session) => {
  return WorkingHourRules.findOneAndUpdate(
    { applied: true },
    { applied: false },
    { session: session }
  )
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// find and update rule
const ruleApplication = async (id, ruleData, session) => {
  return WorkingHourRules.findOneAndUpdate({ _id: id }, ruleData, {
    session: session,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// find and remove rule
const removeRuleMiddleware = async (id) => {
  return WorkingHourRules.findByIdAndDelete(id)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

// find user by id
const findWorkingHourRuleById = async (id) => {
  return WorkingHourRules.findById({ _id: id })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

//get checkIn time range
const checkInTimeRangeMiddleware = async () => {
  // Get working hour rules for the current date
  const workingHourRules = await getAppliedWorkingHourRuleMiddleware();

  // Extract time range values
  const checkinTimeRanges = workingHourRules.map((rule) => ({
    checkin_time_start: convertStringTimeToDateTime(rule.checkin_time_start),
    checkin_time_end: convertStringTimeToDateTime(rule.checkin_time_end),
  }));

  return checkinTimeRanges;
};
module.exports = {
  addWorkingHourRulesMiddleware,
  getAllWorkingHourRuleMiddleware,
  getWorkingHourRuleIdMiddleware,
  getAppliedWorkingHourRuleMiddleware,
  disableWorkingHourRules,
  ruleApplication,
  removeRuleMiddleware,
  findWorkingHourRuleById,
  checkInTimeRangeMiddleware,
};
