const {
  convertMsToTime,
  startAndEndOfDay,
  startAndEndOfWeek,
} = require("../../middleware/commonMiddleware");
const { CheckIns } = require("../../models/checkIn");
const {
  checkInTimeRangeMiddleware,
} = require("../workingHourRules/workingHourRulesHelper");
const { ObjectId } = require("mongoose").Types;

//find user's last check in
const findUserLastCheckIn = async (id) => {
  return CheckIns.findOne({ user: id }, null, { sort: { updatedAt: -1 } })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

//record checkin
const recordCheckInMiddleware = async (checkIns) => {
  try {
    const result = await CheckIns.create([checkIns]);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//record checkout
const recordCheckOutMiddleware = async (id, data) => {
  return CheckIns.findOneAndUpdate({ _id: id }, data)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

//get all check-in/check-outs
const getAllCheckInsMiddleware = async (body) => {
  let condition = {};

  if (body.specificDate) {
    //input in the format "YYYY-MM-DD"

    const { startOfDay, endOfDay } = startAndEndOfDay(body.specificDate);

    condition["createdAt"] = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  } else if (body.specificMonth) {
    //input in the format "YYYY-MM"
    const [year, month] = body.specificMonth.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1); // Month is zero-based in JavaScript
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    condition["createdAt"] = {
      $gte: startDate,
      $lte: endOfMonth,
    };
  } else {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    condition["createdAt"] = {
      $gte: startOfMonth,
      $lte: endOfMonth,
    };
  }

  return CheckIns.aggregate([
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        user: {
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
    {
      $sort: {
        updatedAt: -1, //Sort by Date Added DESC
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

//get all check-in check-outs of specific user
const getAllCheckInsByUserIdAndMonthMiddleware = async (
  userId,
  specificMonth
) => {
  const id = new ObjectId(userId);

  let condition = {};

  // if user filter a specific month then
  if (specificMonth) {
    //input in the format "YYYY-MM"
    const [year, month] = specificMonth.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1); // Month is zero-based in JavaScript
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    condition["createdAt"] = {
      $gte: startDate,
      $lte: endOfMonth,
    };
  } else {
    //otheriwse return data of current month
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    condition["createdAt"] = {
      $gte: startOfMonth,
      $lte: endOfMonth,
    };
  }

  //add user id too
  condition["user"] = {
    $eq: id,
  };

  return CheckIns.aggregate([
    {
      $match: condition,
    },

    {
      $project: {
        check_in_time: 1,
        check_out_time: 1,
        createdAt: 1,
        updatedAt: 1,
        day: { $dayOfMonth: { date: "$createdAt", timezone: "UTC" } },
        month: { $month: { date: "$createdAt", timezone: "UTC" } },
        year: { $year: { date: "$createdAt", timezone: "UTC" } },
      },
    },
    {
      $group: {
        _id: {
          year: "$year",
          month: "$month",
        },

        checkIns: { $push: "$$ROOT" },
      },
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.month": -1,
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

//get all check-in check-outs of specific user
const getAllCheckInsByUserIdAndYearMiddleware = async (
  userId,
  specificYear
) => {
  const id = new ObjectId(userId);

  let condition = {};

  //if user filters a specific year
  if (specificYear) {
    //input in the format "YYYY"
    const year = parseInt(specificYear, 10);

    const startOfYear = new Date(year, 0, 1); // Month is zero-based in JavaScript
    const endOfYear = new Date(year, 12, 0, 23, 59, 59, 999);

    condition["createdAt"] = {
      $gte: startOfYear,
      $lte: endOfYear,
    };
  } else {
    //otherwise, return data of the current year
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(
      currentDate.getFullYear(),
      12,
      0,
      23,
      59,
      59,
      999
    );
    condition["createdAt"] = {
      $gte: startOfYear,
      $lte: endOfYear,
    };
  }
  //add user id too
  condition["user"] = {
    $eq: id,
  };

  return CheckIns.aggregate([
    {
      $match: condition,
    },

    {
      $project: {
        check_in_time: 1,
        check_out_time: 1,
        createdAt: 1,
        updatedAt: 1,
        day: { $dayOfMonth: { date: "$createdAt", timezone: "UTC" } },
        month: { $month: { date: "$createdAt", timezone: "UTC" } },
        year: { $year: { date: "$createdAt", timezone: "UTC" } },
      },
    },
    {
      $group: {
        _id: {
          year: "$year",
          month: "$month",
        },

        checkIns: { $push: "$$ROOT" },
      },
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.month": -1,
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

//get today's record
const getUserTodaysCheckIns = async (userId) => {
  const id = new ObjectId(userId);
  const { startOfDay, endOfDay } = startAndEndOfDay();

  return CheckIns.aggregate([
    {
      $match: {
        user: id,
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $project: {
        check_in_time: 1,
        check_out_time: 1,
        createdAt: 1,
        updatedAt: 1,
        day: { $dayOfMonth: { date: "$createdAt", timezone: "UTC" } },
        month: { $month: { date: "$createdAt", timezone: "UTC" } },
        year: { $year: { date: "$createdAt", timezone: "UTC" } },
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

//get weekly record
const getUserWeeklyCheckIns = async (userId) => {
  const id = new ObjectId(userId);

  const { startOfLastWeek, endOfLastWeek } = startAndEndOfWeek();

  return CheckIns.aggregate([
    {
      $match: {
        user: id,
        createdAt: {
          $gte: startOfLastWeek,
          $lte: endOfLastWeek,
        },
      },
    },
    {
      $project: {
        user: 1,
        check_in_time: 1,
        check_out_time: 1,
        createdAt: 1,
        updatedAt: 1,
        day: { $dayOfMonth: { date: "$createdAt", timezone: "UTC" } },
        month: { $month: { date: "$createdAt", timezone: "UTC" } },
        year: { $year: { date: "$createdAt", timezone: "UTC" } },
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

//get monthly record
const getUserMonthlyCheckIns = async (userId) => {
  const id = new ObjectId(userId);

  const date = new Date();
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return CheckIns.aggregate([
    {
      $match: {
        user: id,
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $project: {
        user: 1,
        check_in_time: 1,
        check_out_time: 1,
        createdAt: 1,
        updatedAt: 1,
        day: { $dayOfMonth: { date: "$createdAt", timezone: "UTC" } },
        month: { $month: { date: "$createdAt", timezone: "UTC" } },
        year: { $year: { date: "$createdAt", timezone: "UTC" } },
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

//get today's working remaining working hours
const remainingWorkingHoursMiddleware = (checkIns, totalOfficeHours) => {
  //first check if there is check-in and also check-out then firs calculate the time interval
  let totalWorkedMiliseconds = 0;
  checkIns.map((checkIn) => {
    if (checkIn.check_in_time && checkIn.check_out_time) {
      const checkInTime = new Date(checkIn.check_in_time);
      const checkOutTime = new Date(checkIn.check_out_time);

      const remainingTime = checkOutTime - checkInTime;

      totalWorkedMiliseconds = totalWorkedMiliseconds + remainingTime;
    } else {
      const currentTime = new Date();
      const checkInTime = new Date(checkIn.check_in_time);

      const remainingTime = currentTime - checkInTime;

      totalWorkedMiliseconds = totalWorkedMiliseconds + remainingTime;
    }
  });

  //we got complete working record in miliseconds
  //now calculate the remaining time
  const hours = totalOfficeHours;
  const totalWorkingMilliseconds = hours * 3600000;

  const remainingWorkingTime =
    totalWorkingMilliseconds - totalWorkedMiliseconds;

  return {
    overTime: remainingWorkingTime < 0 ? true : false,
    remainingTime: convertMsToTime(Math.abs(remainingWorkingTime)),
    totalWorkingDuration: convertMsToTime(Math.abs(totalWorkedMiliseconds)),
  };
};

//middleware to calculate working hours of day and week
const getTotalWorkingHoursOfDayAndWeek = (rules) => {
  const totalOfficeHoursDaily = rules.working_hours_per_day + rules.break_time;
  // Calculate total working hours for the month based on the fixed number of working days per week
  const totalOfficeHoursWeekly =
    totalOfficeHoursDaily * rules.number_of_working_days;
  return {
    totalOfficeHoursDaily,
    totalOfficeHoursWeekly,
  };
};

//middleware to get monthly working hours
const getTotalWorkingHoursMonthly = (totalOfficeHoursWeekly, specificMonth) => {
  const currentDate = specificMonth ? new Date(specificMonth) : new Date();

  // Get the last day of the specified month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const totalDaysInMonth = lastDayOfMonth.getDate();

  const totalOfficeHoursMonthly =
    totalOfficeHoursWeekly * (totalDaysInMonth / 7);

  return {
    totalOfficeHoursMonthly,
  };
};

//get yearly working hours group by months
const getTotalWorkingHoursYearly = (totalOfficeHoursWeekly, specificYear) => {
  const startMonth = 0; // January (month is zero-based)
  const endMonth = 11; // December

  const yearlyWorkingHours = [];

  for (let month = startMonth; month <= endMonth; month++) {
    // Get the first day of each month
    const firstDayOfMonth = new Date(specificYear, month, 1);

    // Get the last day of each month
    const lastDayOfMonth = new Date(specificYear, month + 1, 0);

    const totalDaysInMonth = lastDayOfMonth.getDate();

    const totalOfficeHoursMonthly =
      totalOfficeHoursWeekly * (totalDaysInMonth / 7);

    yearlyWorkingHours.push({
      month: month + 1, // Adding 1 to convert zero-based month to one-based month
      totalOfficeHoursMonthly,
    });
  }

  return yearlyWorkingHours;
};

//get today's checkIns group by users
const getUserTodaysCheckInsGroupByUsers = async () => {
  const { startOfDay, endOfDay } = startAndEndOfDay();

  return CheckIns.aggregate([
    {
      $match: {
        check_in_time: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $sort: {
        check_in_time: 1,
      },
    },
    {
      $group: {
        _id: "$user",
        firstCheckIn: {
          $first: "$check_in_time",
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

//get today's record for admin
const getUserTodaysRecordForAdmin = async () => {
  // Extract time range values
  const checkinTimeRanges = await checkInTimeRangeMiddleware();

  // Get check-ins for the current date
  const todayCheckIns = await getUserTodaysCheckInsGroupByUsers();

  // Filter check-ins based on the time range of working hour rules
  const filteredCheckIns = todayCheckIns.map((checkIn) => {
    const onTimeCheckIn = checkinTimeRanges.some(
      (range) => checkIn.firstCheckIn <= range.checkin_time_end
    );

    return {
      user: checkIn._id,
      onTimeCheckIn,
      lateCheckIn: !onTimeCheckIn,
    };
  });

  return filteredCheckIns;
};

module.exports = {
  findUserLastCheckIn,
  recordCheckInMiddleware,
  recordCheckOutMiddleware,
  getAllCheckInsMiddleware,
  getAllCheckInsByUserIdAndMonthMiddleware,
  getAllCheckInsByUserIdAndYearMiddleware,
  getUserTodaysCheckIns,
  getUserWeeklyCheckIns,
  getUserMonthlyCheckIns,
  remainingWorkingHoursMiddleware,
  getTotalWorkingHoursOfDayAndWeek,
  getTotalWorkingHoursMonthly,
  getTotalWorkingHoursYearly,
  getUserTodaysRecordForAdmin,
};
