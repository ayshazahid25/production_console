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

const customException = (message, statusCode) => {
  console.log("message::", message);
  const error = new Error(message);

  error.statusCode = statusCode;
  return error;
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

// Helper function to parse time string into hours and minutes
const parseTimeString = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
};

// Helper function to convert string time to Date object
const convertStringTimeToDateTime = (checkIn) => {
  let dateTime = new Date();
  let [hours, minutes] = checkIn.split(":");
  dateTime.setHours(+hours);
  dateTime.setMinutes(minutes);
  return dateTime;
};

// Helper to return current date's start of day and end of day
const startAndEndOfDay = (specificDate) => {
  const date = new Date();
  const startOfDay = new Date(specificDate ? specificDate : date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(specificDate ? specificDate : date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
};

// Helper to return current date's start of day and end of week
const startAndEndOfWeek = () => {
  const date = new Date();

  const startOfLastWeek = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
  startOfLastWeek.setUTCHours(0, 0, 0, 0);

  const endOfLastWeek = new Date(date);
  endOfLastWeek.setUTCHours(23, 59, 59, 999);
  return { startOfLastWeek, endOfLastWeek };
};

module.exports = {
  expressValidatorError,
  generateToken,
  customException,
  encryptPassword,
  convertMsToTime,
  convertStringTimeToDateTime,
  startAndEndOfDay,
  startAndEndOfWeek,
};
