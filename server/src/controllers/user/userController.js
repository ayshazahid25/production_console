const asyncHandler = require("express-async-handler");
const {
  generateToken,
  expressValidatorError,
  encryptPassword,
} = require("../../middleware/commonMiddleware");
const bcrypt = require("bcryptjs");
const {
  findUser,
  addUserMiddleware,
  getAllusersMiddleware,
  getUserByIdWithDetailMiddleware,
  userUpdation,
  getActiveUsersMiddleware,
  findUserById,
} = require("./userHelper");
const {
  validateUpdateUser,
  validateCreateUser,
  validateContractDuration,
} = require("../../models/user");
const _ = require("lodash");

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  //validate requested data
  expressValidatorError(req);

  try {
    //check user email verification
    const user = await findUser(req.body.email);

    if (!user) {
      res.status(400);
      throw new Error("No user found!");
    }

    //check password and give token
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      return res.status(200).send({
        token: generateToken(user),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials or user not found.");
    }
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${res.statusCode !== 400 ? "Something went wrong during login: " : ""}${
        error.message
      }`
    );
  }
});

// @desc Create user
// @route POST /api/user
// @access Public
const createUser = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  //validate requested data
  expressValidatorError(req);

  try {
    req.body.added_by = req.result._id.toString();

    // create admin
    if (req.body) {
      const { error } = validateCreateUser(req.body);

      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
    }
    const userData = _.pick(req.body, [
      "email",
      "is_admin",
      "title",
      "first_name",
      "last_name",
      "gender",
      "phone_number",
      "cnic",
      "address",
      "added_by",
    ]);

    userData.contract_durations = [];
    userData.contract_durations.push({
      employment_type: req.body.employment_type,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    });
    userData.password = await encryptPassword(req.body.password);

    const userCreated = await addUserMiddleware(userData);

    if (!userCreated) {
      res.status(400);
      throw new Error("User could not be created.");
    }

    return res.status(200).json({ message: "User created successfully" });
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
          ? "Something went wrong while creating user: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get logedin user
// @route GET /api/users/
// @access Private
const getUser = asyncHandler(async (req, res) => {
  res.json(req.result);
});

// @desc get all users
// @route GET /api/users/all
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    //get all users
    const users = await getAllusersMiddleware(req.result._id);

    if (!users) {
      res.status(400);
      throw new Error("No user found");
    }

    res.status(200).json({
      users,
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
          ? "Something went wrong while fetching users: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get active user data
// @route GET /api/users/active
// @access Private
const getActiveUsers = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  try {
    //get all active users
    const users = await getActiveUsersMiddleware(req.result._id);

    if (!users) {
      res.status(400);
      throw new Error("No user found");
    }

    res.status(200).json({
      users,
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
          ? "Something went wrong while fetching active users: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get user by id
// @route GET /api/users/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
  if (!req.result.is_admin && req.params.id !== req.result._id.toString()) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);
  try {
    //find only one user with added by, updated by, and permission settings
    const user = await getUserByIdWithDetailMiddleware(req.params.id);

    if (!user || user.length === 0) {
      res.status(400);
      throw new Error("User don't exist");
    }

    res.status(200).json({
      user,
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
          ? "Something went wrong while fetching user data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Update user
// @route POST /api/users/user_update/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  if (!req.result.is_admin && req.params.id !== req.result._id.toString()) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate param data
  expressValidatorError(req);

  const userDetail = req.body;

  userDetail.updated_by = req.result._id.toString();

  // validate userDetail
  if (userDetail) {
    const { error } = validateUpdateUser(userDetail);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
  }

  try {
    // check if user exist with param id
    const findUser = await findUserById(req.params.id);

    if (!findUser) {
      res.status(400);
      throw new Error("User don't exist");
    }

    //now update that user
    const userUpdated = await userUpdation(req.params.id, userDetail);

    if (!userUpdated) {
      res.status(400);
      throw new Error("User could not be updated.");
    }

    return res.status(200).json({ message: "User updated successfully!" });
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
          ? "Something went wrong in user updation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Freeze users or one user
// @route POST /api/users/freeze/:id
// @access Private
const freezeBulkUser = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);

  const userDetail = new Object();
  userDetail.is_active = req.body.is_active;
  userDetail.updated_by = req.result._id.toString();

  try {
    // check if user exist with param id
    const findUser = await findUserById(req.params.id);

    if (!findUser) {
      res.status(400);
      throw new Error("User don't exist");
    }

    //now update user
    const userUpdated = await userUpdation(req.params.id, userDetail);
    if (!userUpdated) {
      res.status(400);
      throw new Error("User could not be updated.");
    }

    return res.status(200).json({ message: "User updated successfully!" });
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
          ? `Something went wrong during user updation: `
          : ""
      }${error.message}`
    );
  }
});

// @desc Freeze users or one user
// @route POST /api/users/reset_password/:id
// @access Private
const resetUserPassword = asyncHandler(async (req, res) => {
  if (!req.result.is_admin && req.params.id !== req.result._id.toString()) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  //validate input data
  expressValidatorError(req);

  const userDetail = new Object();
  userDetail.password = await encryptPassword(req.body.password);
  userDetail.updated_by = req.result._id.toString();

  try {
    //check if user exist with param id
    const findUser = await findUserById(req.params.id);

    if (!findUser) {
      res.status(400);
      throw new Error("User don't exist");
    }

    //now update that user
    const userUpdated = await userUpdation(req.params.id, userDetail);
    if (!userUpdated) {
      res.status(400);
      throw new Error("Password could not be updated.");
    }

    return res.status(200).json({ message: "Password updated successfully!" });
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
          ? "Something went wrong during password reset: "
          : ""
      }${error.message}`
    );
  }
});

// @desc renew user contract
// @route POST /api/users/renew_contract/:id
// @access Private
const renewContract = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate param data
  expressValidatorError(req);

  const userDetail = req.body;

  userDetail.updated_by = req.result._id.toString();

  // validate userDetail
  if (userDetail) {
    const { error } = validateContractDuration(userDetail);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
  }

  try {
    // check if user exist with param id
    const findUser = await findUserById(req.params.id);

    if (!findUser) {
      res.status(400);
      throw new Error("User don't exist");
    }

    //now update that user
    const userUpdated = await userUpdation(req.params.id, userDetail);
    if (!userUpdated) {
      res.status(400);
      throw new Error("Unable to renew contract.");
    }
    return res.status(200).json({ message: "Contract renewed successfully!" });
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
          ? "Something went wrong while renewing user's contract: "
          : ""
      }${error.message}`
    );
  }
});
module.exports = {
  loginUser,
  createUser,
  getUser,
  getAllUsers,
  getActiveUsers,
  getUserById,
  updateUser,
  freezeBulkUser,
  resetUserPassword,
  renewContract,
};
