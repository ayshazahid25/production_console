const mongoose = require("mongoose");
const Joi = require("joi-oid");

// Schema
const schemaLeaveType = new mongoose.Schema(
  {
    leave_type_title: {
      type: String,
      required: true,
    },
    leave_description: {
      type: String,
    },
    leave_days_per_year: {
      type: Number,
      min: 1,
      max: 365,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female", "both"],
      default: "both",
    },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//joi validation
function validateLeaveType(leave) {
  const schema = Joi.object({
    leave_type_title: Joi.string().required(),
    leave_description: Joi.string().optional().allow(null).allow("").empty(""),
    leave_days_per_year: Joi.number().min(1).max(365),
    gender: Joi.string().valid("male", "female", "both").default("both"),
    added_by: Joi.objectId().optional().allow(null).allow("").empty(""),
    updated_by: Joi.objectId().optional().allow(null).allow("").empty(""),
  });
  return schema.validate(leave);
}

const LeaveTypes = mongoose.model("LeaveType", schemaLeaveType);
exports.LeaveTypes = LeaveTypes;
exports.validateLeaveType = validateLeaveType;
