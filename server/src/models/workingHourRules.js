const mongoose = require("mongoose");
const Joi = require("joi-oid");

// Schema
const schemaWorkingHourRules = new mongoose.Schema(
  {
    working_hours_per_day: {
      type: Number,
      min: 1,
      max: 24,
    },
    break_time: {
      type: Number,
      min: 0,
      max: 24,
    },
    number_of_working_days: {
      //weekly working days
      type: Number,
      min: 1,
      max: 7,
    },
    //time range
    checkin_time_start: {
      type: String,
    },
    checkin_time_end: {
      type: String,
    },
    applied: {
      type: Boolean,
      default: false,
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
function validateWorkingHourRules(data) {
  const schema = Joi.object({
    working_hours_per_day: Joi.number().min(1).max(24),
    break_time: Joi.number().min(0).max(24),
    number_of_working_days: Joi.number().min(1).max(7),
    checkin_time_start: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .allow(""),
    checkin_time_end: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .allow(""),
    added_by: Joi.objectId().optional().allow(null).allow("").empty(""),
    updated_by: Joi.objectId().optional().allow(null).allow("").empty(""),
  });
  return schema.validate(data);
}

const WorkingHourRules = mongoose.model(
  "WorkingHourRules",
  schemaWorkingHourRules
);
exports.WorkingHourRules = WorkingHourRules;
exports.validateWorkingHourRules = validateWorkingHourRules;
