const { validateCheckIn } = require("../../models/checkIn");
const asyncHandler = require("express-async-handler");

const {
  findUserLastCheckIn,
  recordCheckInMiddleware,
  recordCheckOutMiddleware,
  getAllCheckInsMiddleware,
  getAllCheckInsByUserIdAndMonthMiddleware,
  getUserTodaysCheckIns,
  remainingWorkingHoursMiddleware,
  getUserWeeklyCheckIns,
  getUserMonthlyCheckIns,
  getTotalWorkingHoursMonthly,
  getAllCheckInsByUserIdAndYearMiddleware,
  getTotalWorkingHoursOfDayAndWeek,
  getTotalWorkingHoursYearly,
  getUserTodaysRecordForAdmin,
} = require("./checkInHelper");
const { expressValidatorError } = require("../../middleware/commonMiddleware");
const {
  getAppliedWorkingHourRuleMiddleware,
} = require("../workingHourRules/workingHourRulesHelper");
const { countActiveEmployees } = require("../user/userHelper");
const { getTodayUsersOnLeave } = require("../userLeave/userLeaveHelper");

// @desc add check-in , check-out time
// @route POST /api/check_in
// @access Public
const recordCheckInOut = asyncHandler(async (req, res) => {
  //validate requested data
  expressValidatorError(req);
  const checkIns = req.body;
  checkIns.user = req.result._id.toString();
  delete checkIns.manual;

  try {
    // create admin
    if (checkIns) {
      const { error } = validateCheckIn(checkIns);

      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
    }
    //find user's last checkin/checkout record
    const record = await findUserLastCheckIn(req.result._id);

    if (checkIns.check_in_time) {
      if (record) {
        if (!record.check_out_time) {
          res.status(400);
          throw new Error(
            "Unable to Check In. You cannot check in again without checking out from your last session. Please check out first."
          );
        }
        //also check if user tried to enter checkin smaller than last checkout, then throw error
        const lastCheckoutUTC = record.check_out_time;

        if (record && checkIns.check_in_time <= lastCheckoutUTC) {
          res.status(400);
          throw new Error(
            "Unable to Check In. Please select a check-in time after your last check-out."
          );
        }
      }

      //we can record check in time now
      const checkInRecorded = await recordCheckInMiddleware(checkIns);

      if (!checkInRecorded) {
        res.status(400);
        throw new Error("Unable to record check-in");
      }

      return res
        .status(200)
        .json({ message: "Check-in recorded successfully!" });
    } else {
      if (
        !record ||
        !record.check_in_time ||
        (record.check_in_time && record.check_out_time)
      ) {
        res.status(400);
        throw new Error(
          "Unable to Check Out. You cannot check out without first checking in. Please ensure you have checked in for the day before attempting to check out."
        );
      }

      const lastCheckinUTC = record.check_in_time;

      if (record && checkIns.check_out_time <= lastCheckinUTC) {
        res.status(400);
        throw new Error(
          "Unable to Check Out. Check-out time cannot be earlier than the check-in time."
        );
      }

      //now we can update the record and add it's checkout time
      const checkOutRecoded = await recordCheckOutMiddleware(
        record._id.toString(),
        checkIns
      );

      if (!checkOutRecoded) {
        res.status(400);
        throw new Error("Unable to record check-out");
      }

      return res
        .status(200)
        .json({ message: "Check-out recorded successfully!" });
    }
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
          ? "Something went wrong while recording check-in/check-out: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get all checkins
// @route GET /api/check_in/all
// @access Private
const getAllCheckIns = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  expressValidatorError(req);

  try {
    //get all checkIns

    const checkIns = await getAllCheckInsMiddleware(req.body);

    if (!checkIns) {
      res.status(400);
      throw new Error("Unable to find any check-in/check-out!");
    }

    res.status(200).json({
      checkIns,
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
          ? "Something went wrong while fetching check-in/check-out data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get all checkins for specific user
// @route GET /api/check_in/:id
// @access Private
const getAllCheckInsByUserId = asyncHandler(async (req, res) => {
  if (!req.result.is_admin && req.params.id !== req.result._id.toString()) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  expressValidatorError(req);

  try {
    //get all checkIns
    const checkIns = await getAllCheckInsByUserIdAndMonthMiddleware(
      req.params.id,
      req.body.specificMonth
    );

    if (!checkIns) {
      res.status(400);
      throw new Error("Unable to find any check-in/check-out!");
    }

    res.status(200).json({
      checkIns,
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
          ? "Something went wrong while fetching check-in/check-out data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get remaining working hours
// @route GET /api/check_in/report/:id
// @access Private
const reportOfRemainingWorkingHours = asyncHandler(async (req, res) => {
  if (req.params.id !== req.result._id.toString()) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  expressValidatorError(req);

  try {
    //get user today's check in and check out record
    const todayCheckIns = await getUserTodaysCheckIns(req.params.id);

    if (!todayCheckIns) {
      res.status(400);
      throw new Error(
        "No check-in or check-out entry found for today. Please check in or check out to record your attendance."
      );
    }

    //get user weekly check in and check out record
    const weeklyCheckIns = await getUserWeeklyCheckIns(req.params.id);

    if (!weeklyCheckIns) {
      res.status(400);
      throw new Error(
        "No check-in or check-out entry found for this week. Please check in or check out to record your attendance."
      );
    }

    //get user monthly check in and check out record
    const monthlyCheckIns = await getUserMonthlyCheckIns(req.params.id);

    if (!monthlyCheckIns) {
      res.status(400);
      throw new Error(
        "No check-in or check-out entry found for this month. Please check in or check out to record your attendance."
      );
    }

    //now get applied working hour rule
    const rules = await getAppliedWorkingHourRuleMiddleware();

    if (!rules) {
      res.status(400);
      throw new Error("No rule found!");
    }

    const { totalOfficeHoursDaily, totalOfficeHoursWeekly } =
      getTotalWorkingHoursOfDayAndWeek(rules[0]);

    const { totalOfficeHoursMonthly } = getTotalWorkingHoursMonthly(
      totalOfficeHoursWeekly
    );

    const dailyReport = remainingWorkingHoursMiddleware(
      todayCheckIns,
      totalOfficeHoursDaily
    );

    const weeklyReport = remainingWorkingHoursMiddleware(
      todayCheckIns,
      totalOfficeHoursWeekly
    );

    const monthlyReport = remainingWorkingHoursMiddleware(
      todayCheckIns,
      totalOfficeHoursMonthly
    );

    res.status(200).json({
      dailyReport,
      weeklyReport,
      monthlyReport,
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
          ? "Something went wrong while fetching check-in/check-out data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get report by specific month
// @route GET /api/check_in/report-month/:id
// @access Private
const reportOfWorkingHoursOfMonth = asyncHandler(async (req, res) => {
  if (req.params.id !== req.result._id.toString()) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  expressValidatorError(req);

  try {
    //get all checkIns
    const checkIns = await getAllCheckInsByUserIdAndMonthMiddleware(
      req.params.id,
      req.body.specificMonth
    );

    if (!checkIns) {
      res.status(400);
      throw new Error("Unable to find any check-in/check-out!");
    }

    //now get applied working hour rule
    const rules = await getAppliedWorkingHourRuleMiddleware();

    if (!rules) {
      res.status(400);
      throw new Error("No rule found!");
    }

    const { totalOfficeHoursWeekly } = getTotalWorkingHoursOfDayAndWeek(
      rules[0]
    );

    const { totalOfficeHoursMonthly } = getTotalWorkingHoursMonthly(
      totalOfficeHoursWeekly,
      req.body.specificMonth
    );

    const monthlyReport = remainingWorkingHoursMiddleware(
      checkIns.length > 0 ? checkIns[0].checkIns : checkIns,
      totalOfficeHoursMonthly
    );

    res.status(200).json({
      monthlyReport,
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
          ? "Something went wrong while fetching check-in/check-out data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get report by specific year
// @route GET /api/check_in/report-yearly/:id
// @access Private
const reportOfWorkingHoursOfYear = asyncHandler(async (req, res) => {
  if (req.params.id !== req.result._id.toString()) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  expressValidatorError(req);

  try {
    //get all checkIns
    const checkIns = await getAllCheckInsByUserIdAndYearMiddleware(
      req.params.id,
      req.body.specificYear
    );

    if (!checkIns) {
      res.status(400);
      throw new Error("Unable to find any check-in/check-out!");
    }

    //now get applied working hour rule
    const rules = await getAppliedWorkingHourRuleMiddleware();

    if (!rules) {
      res.status(400);
      throw new Error("No rule found!");
    }

    const { totalOfficeHoursWeekly } = getTotalWorkingHoursOfDayAndWeek(
      rules[0]
    );

    const yearlyWorkingHours = getTotalWorkingHoursYearly(
      totalOfficeHoursWeekly,
      req.body.specificYear
    );

    const yearlyData = [];

    checkIns.map((data) => {
      const totalOfficeHoursMonthly = yearlyWorkingHours.filter(
        (yearlyData) => data._id.month === yearlyData.month
      )[0].totalOfficeHoursMonthly;

      const monthlyReport = remainingWorkingHoursMiddleware(
        data.checkIns,
        totalOfficeHoursMonthly
      );

      yearlyData.push(data._id, { report: monthlyReport });
    });

    res.status(200).json({
      yearlyData,
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
          ? "Something went wrong while fetching check-in/check-out data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc admin dashboard
// @route GET /api/check_in/admin-dashboard/
// @access Private
const adminDashboard = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    // get user today's check-in and check-out record
    const todayRecords = await getUserTodaysRecordForAdmin();

    if (!todayRecords) {
      res.status(400);
      throw new Error("No check-in or check-out entry found for today.");
    }

    //total number of employees
    const totalEmployees = await countActiveEmployees();

    const onTimeCheckIns = todayRecords.filter(
      (record) => record.onTimeCheckIn
    );
    const lateCheckIns = todayRecords.filter((record) => record.lateCheckIn);

    // Count users on leave
    const usersOnLeave = await getTodayUsersOnLeave();

    // Calculate the number of users who have not checked in and are not on leave
    const notCheckedIn =
      totalEmployees -
      onTimeCheckIns.length -
      lateCheckIns.length -
      usersOnLeave;

    // Subtract users on leave from total employees
    const totalEmployeesWithoutLeave = totalEmployees - usersOnLeave;

    // Calculate percentages only based on users who are not on leave
    const onTimePercentage =
      totalEmployeesWithoutLeave > 0
        ? (onTimeCheckIns.length / totalEmployeesWithoutLeave) * 100
        : 0;
    const latePercentage =
      totalEmployeesWithoutLeave > 0
        ? (lateCheckIns.length / totalEmployeesWithoutLeave) * 100
        : 0;
    const notCheckedInPercentage =
      totalEmployeesWithoutLeave > 0
        ? ((totalEmployeesWithoutLeave -
            onTimeCheckIns.length -
            lateCheckIns.length) /
            totalEmployeesWithoutLeave) *
          100
        : 0;
    const usersOnLeavePercentage =
      totalEmployeesWithoutLeave > 0
        ? (usersOnLeave / totalEmployeesWithoutLeave) * 100
        : 0;

    res.status(200).json({
      totalEmployees: totalEmployees,
      totalEmployeesWithoutLeave: totalEmployeesWithoutLeave,
      onTimeCheckIns: onTimeCheckIns.length,
      onTimePercentage,
      lateCheckIns: lateCheckIns.length,
      latePercentage,
      notCheckedIn,
      notCheckedInPercentage,
      usersOnLeave,
      usersOnLeavePercentage,
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
          ? "Something went wrong while fetching check-in/check-out data: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  recordCheckInOut,
  getAllCheckIns,
  getAllCheckInsByUserId,
  reportOfRemainingWorkingHours,
  reportOfWorkingHoursOfMonth,
  reportOfWorkingHoursOfYear,
  adminDashboard,
};
