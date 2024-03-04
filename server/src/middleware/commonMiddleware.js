const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${msg}`;
};

const expressValidatorError = (req) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    throw new Error(result.array());
  }
};

// generate token after login
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "120h",
    }
  );
};

//encrtpt password
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const encryptPass = await bcrypt.hash(password, salt);

  return encryptPass;
};

//to convert number like 3 to 03
const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

//Convert Milliseconds to Hours, Minutes, Seconds
const convertMsToTime = (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds = seconds % 60;
  minutes = minutes % 60;

  return {
    hours,
    minutes,
    seconds,
  };
};

module.exports = {
  expressValidatorError,
  generateToken,
  encryptPassword,
  convertMsToTime,
};
