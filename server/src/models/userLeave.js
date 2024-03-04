const mongoose = require("mongoose");
const Joi = require("joi-oid");

// Schema
const schemaUserLeave = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leave_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
    },
    starting_date: {
      type: Date,
      default: Date.now,
    },
    ending_date: {
      type: Date,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "cancle", "pending"],
      default: "pending",
      lowercase: true,
      index: true,
    },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//joi validation
function validateUserLeaves(leave) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    leave_type: Joi.objectId().required(),
    starting_date: Joi.date().default(Date.now),
    ending_date: Joi.date().required(),
    reason: Joi.string().required(),
  });
  return schema.validate(leave);
}
function validateUpdateLeaveStatus(leave) {
  const schema = Joi.object({
    status: Joi.string().valid("approved", "cancle", "pending").required(),
    approved_by: Joi.objectId().required(),
  });
  return schema.validate(leave);
}

const UserLeaves = mongoose.model("UserLeave", schemaUserLeave);
exports.UserLeaves = UserLeaves;
exports.validateUserLeaves = validateUserLeaves;
exports.validateUpdateLeaveStatus = validateUpdateLeaveStatus;
