const express = require("express");
let cors = require("cors");

const { errorHandler } = require("../src/middleware/errorMiddleware"),
  seeder = require("../src/routes/seeder"),
  user = require("../src/routes/user"),
  checkin = require("../src/routes/checkIn"),
  working_hour_rules = require("../src/routes/workingHourRules"),
  leave_type = require("../src/routes/leaveType"),
  user_leave = require("../src/routes/userLeave");

module.exports = function (app) {
  app.use(express.static("public"));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors());

  app.use("/seeder", seeder);
  app.use("/api/users", user);
  app.use("/api/check_in", checkin);
  app.use("/api/working_hour_rules", working_hour_rules);
  app.use("/api/leave_type", leave_type);
  app.use("/api/user_leave", user_leave);

  app.use(errorHandler);
};
