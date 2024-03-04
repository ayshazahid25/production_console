const express = require("express");
const { body, param } = require("express-validator");
const {
  loginUser,
  createUser,
  getUser,
  getAllUsers,
  getUserById,
  updateUser,
  freezeBulkUser,
  getActiveUsers,
  resetUserPassword,
  renewContract,
} = require("../controllers/user/userController");
const { protect } = require("../middleware/authMiddleware");
const route = express.Router();

//login
route.post(
  "/login",
  [
    body("email")
      .isEmail()
      .trim()
      .escape()
      .withMessage("Please enter a valid email"),
    body("password")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Password field cannot be empty"),
  ],
  loginUser
);

//create
route.post(
  "/",
  [
    // Validate credentials
    body("email")
      .isEmail()
      .trim()
      .escape()
      .withMessage("Please enter a valid email"),
    body("password")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Password field cannot be empty"),
    body("is_admin").optional({ checkFalsy: true, nullable: true }).isBoolean(),

    // Validate user info
    body("title").isString().notEmpty().withMessage("Please enter a title"),
    body("first_name")
      .isString()
      .notEmpty()
      .withMessage("Please enter first name"),
    body("last_name")
      .isString()
      .notEmpty()
      .withMessage("Please enter last name"),
    body("gender")
      .not()
      .isEmpty()
      .withMessage("Gender is required")
      .isIn(["male", "female", "other"]),
    body("phone_number")
      .isString()
      .optional({ checkFalsy: true, nullable: true })
      .matches(/^\+\d{12}$|^\d{11}$|^\d{4}-\d{7}$/)
      .withMessage("Please enter a valid phone number"),
    body("cnic")
      .isString()
      .optional({ checkFalsy: true, nullable: true })
      .matches(/^\d{13}$|^\d{5}-\d{7}-\d{1}$/)
      .withMessage("Please enter a valid cnic"),
    body("address")
      .optional({ checkFalsy: true, nullable: true })
      .isString()
      .withMessage("Please enter a valid address"),
    body("employment_type")
      .isString()
      .notEmpty()
      .withMessage("Employment type is required")
      .isIn(["permanent", "probation", "internship", "contract"])
      .withMessage("Invalid employment type")
      .custom((value, { req }) => {
        if (value !== "permanent") {
          if (!req.body.start_date || !req.body.end_date) {
            throw new Error(
              "Both start_date and end_date are required for non-permanent employee"
            );
          }
          const start_date = new Date(req.body.start_date).getTime();
          const end_date = new Date(req.body.end_date).getTime();

          if (start_date > end_date) {
            throw new Error("Start date must be before end date.");
          }

          return true;
        }
      }),

    body("start_date")
      .isISO8601({ strict: true })
      .optional({ checkFalsy: true })
      .withMessage("Please enter a valid start date"),
    body("end_date")
      .isISO8601({ strict: true })
      .optional({ checkFalsy: true })
      .withMessage("Please enter a valid end date"),
  ],
  protect,
  createUser
);

//get logged in user
route.get("/", protect, getUser);

//get all users
route.get("/all", protect, getAllUsers);

//get all active users
route.get("/active", protect, getActiveUsers);

//get user by id
route.get(
  `/:id`,
  [param("id").isMongoId().withMessage("Please enter a valid user id")],
  protect,
  getUserById
);

//update user
route.post(
  `/user_update/:id`,
  [param("id").isMongoId().withMessage("Please enter a valid user id")],
  protect,
  updateUser
);

//freeze user
route.post(
  `/freeze/:id`,
  [
    param("id").isMongoId().withMessage("Please enter a valid user id"),
    body("is_active").isBoolean(),
  ],
  protect,
  freezeBulkUser
);

//reset password
route.post(
  `/reset_password/:id`,
  [
    param("id").isMongoId().withMessage("Please enter a valid user id"),
    body("password")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Password field cannot be empty"),
  ],
  protect,
  resetUserPassword
);

//renew contract user
route.post(
  `/renew_contract/:id`,
  [
    param("id").isMongoId().withMessage("Please enter a valid user id"),

    body("contract_durations")
      .isArray({ min: 1 })
      .withMessage("At least one contract duration must be provided")
      .custom((contractDurations, { req }) => {
        for (let i = 0; i < contractDurations.length; i++) {
          const contractDuration = contractDurations[i];

          // Check employment type
          if (
            !["permanent", "probation", "internship", "contract"].includes(
              contractDuration.employment_type
            )
          ) {
            throw new Error(
              `Invalid employment type in contract duration at index ${i}`
            );
          }

          // Check start and end dates
          if (contractDuration.employment_type !== "permanent") {
            if (!contractDuration.start_date || !contractDuration.end_date) {
              throw new Error(
                `Start and end date are required for non-permanent employment at index ${i}`
              );
            }

            const startDate = new Date(contractDuration.start_date);
            const endDate = new Date(contractDuration.end_date);

            if (startDate >= endDate) {
              throw new Error(
                `End date must be after start date at index ${i}`
              );
            }

            if (i > 0) {
              const prevEndDate = new Date(contractDurations[i - 1].end_date);

              if (startDate < prevEndDate) {
                throw new Error(
                  `Start date must be after the end date of the previous contract duration at index ${i}`
                );
              }
            }
          }
        }

        return true;
      }),
  ],
  protect,
  renewContract
);

module.exports = route;
