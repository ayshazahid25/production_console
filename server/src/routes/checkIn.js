const express = require("express");
const { body, param, check } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  recordCheckInOut,
  getAllCheckIns,
  getAllCheckInsByUserId,
  reportOfRemainingWorkingHours,
  reportOfWorkingHoursOfMonth,
  reportOfWorkingHoursOfYear,
} = require("../controllers/checkIn/checkInController");
const route = express.Router();

//create
route.post(
  "/",
  [
    body("check_in_time")
      .isISO8601({ strict: true })
      .toDate()
      .optional({ checkFalsy: true })
      .withMessage("Please enter a valid check-in date"),
    body("check_out_time")
      .isISO8601({ strict: true })
      .toDate()
      .optional({ checkFalsy: true })
      .withMessage("Please enter a valid check-out date"),
    body("manual", "Manual must be a boolean value")
      .isBoolean()
      .custom((manual, { req }) => {
        if (!manual) {
          if (req.body.check_in_time && req.body.check_out_time) {
            throw new Error("Provide either check in or check out, not both.");
          }

          return true;
        } else {
          if (manual && !req.body.check_in_time) {
            throw new Error("Provide check in value.");
          }
          const check_in_time = new Date(req.body.check_in_time).getTime();
          const check_out_time = new Date(req.body.check_out_time).getTime();

          if (check_in_time > check_out_time) {
            throw new Error("Check-in time must be before check-out time");
          }
          return true;
        }
      }),
  ],
  protect,
  recordCheckInOut
);

//get all checkIns
route.get(
  "/all",
  [
    body("specificDate", "Enter a valid date for specificDate")
      .optional({ checkFalsy: true })
      .custom((value, { req }) => {
        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

        if (!regex.test(value)) {
          throw new Error("Please enter a valid yyyy-mm-dd format.");
        }

        return true;
      }),

    body("specificMonth", "Enter a valid date for specificMonth")
      .optional({ checkFalsy: true })

      .custom((value, { req }) => {
        const regex = /^\d{4}\-(0?[1-9]|1[012])$/;

        if (!regex.test(value)) {
          throw new Error("Please enter a valid yyyy-mm format.");
        }

        // now check that user pnly provide one value not both
        const specificDate = req.body.specificDate;

        if (value && specificDate) {
          throw new Error(
            "Provide either specificDate or specificMonth, not both."
          );
        }

        return true;
      }),
  ],
  protect,
  getAllCheckIns
);

//get all checkIns of specific user
route.get(
  "/:id",
  [
    param("id").isMongoId().withMessage("Please enter a valid user id"),
    body("specificMonth", "Enter a valid date for specificMonth")
      .optional({ checkFalsy: true })
      .custom((value, { req }) => {
        const regex = /^\d{4}\-(0?[1-9]|1[012])$/;

        if (!regex.test(value)) {
          throw new Error("Please enter a valid yyyy-mm format.");
        }

        return true;
      }),
  ],
  protect,
  getAllCheckInsByUserId
);

//get user's remaining working hours
route.get(
  "/report/:id",
  [param("id").isMongoId().withMessage("Please enter a valid user id")],
  protect,
  reportOfRemainingWorkingHours
);

//get user's working hours of specific month
route.get(
  "/report-month/:id",
  [
    param("id").isMongoId().withMessage("Please enter a valid user id"),
    body("specificMonth", "Enter a valid date for specificMonth")
      .optional({ checkFalsy: true })
      .custom((value, { req }) => {
        const regex = /^\d{4}\-(0?[1-9]|1[012])$/;

        if (!regex.test(value)) {
          throw new Error("Please enter a valid yyyy-mm format.");
        }

        return true;
      }),
  ],
  protect,
  reportOfWorkingHoursOfMonth
);
route.get(
  "/report-yearly/:id",
  [
    param("id").isMongoId().withMessage("Please enter a valid user id"),
    body("specificYear", "Enter a valid date for specificYear")
      .optional({ checkFalsy: true })
      .custom((value, { req }) => {
        const regex = /^\d{4}$/;

        if (!regex.test(value)) {
          throw new Error("Please enter a valid yyyy format.");
        }

        return true;
      }),
  ],
  protect,
  reportOfWorkingHoursOfYear
);

module.exports = route;
