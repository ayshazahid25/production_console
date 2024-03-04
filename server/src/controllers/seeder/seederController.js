const asyncHandler = require("express-async-handler");
const { encryptPassword } = require("../../middleware/commonMiddleware");
const { validateCreateUser } = require("../../models/user");
const { addUserMiddleware } = require("../user/userHelper");
const _ = require("lodash");

const userData = {
  email: "admin@admin.com",
  password: "Secret123",
  is_admin: true,
  title: "Super Admin",
  first_name: "Nauman",
  last_name: "Bashir",
  gender: "male",
  employment_type: "permanent",
  start_date: new Date(),
};

// @desc Store data in database
// @route GET /api/seeder
// @access Public
const saveSeeder = asyncHandler(async (req, res) => {
  try {
    // create admin
    if (userData) {
      const { error } = validateCreateUser(userData);

      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
    }
    const seederData = _.pick(userData, [
      "email",
      "is_admin",
      "title",
      "first_name",
      "last_name",
      "gender",
      "phone_number",
      "cnic",
      "address",
    ]);
    seederData.contract_durations = [];
    seederData.contract_durations.push({
      employment_type: userData.employment_type,
      start_date: userData.start_date,
    });
    seederData.password = await encryptPassword(userData.password);

    const userCreated = await addUserMiddleware(seederData);
    if (!userCreated) {
      res.status(400);
      throw new Error("User could not be created.");
    }

    return res.status(200).json({ message: "Seeder created successfully" });
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
          ? "Something went wrong during seeding data: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = { saveSeeder };
