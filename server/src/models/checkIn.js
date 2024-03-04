const mongoose = require("mongoose");
const Joi = require("joi-oid");

// Schema
const schemaCheckIn = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    check_in_time: {
      type: Date,
    },
    check_out_time: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//joi validation
function validateCheckIn(data) {
  const schema = Joi.object({
    user: Joi.objectId(),
    check_in_time: Joi.date().optional().allow(null).allow("").empty(""),
    check_out_time: Joi.date().optional().allow(null).allow("").empty(""),
  });
  return schema.validate(data);
}

const CheckIns = mongoose.model("CheckIn", schemaCheckIn);
exports.CheckIns = CheckIns;
exports.validateCheckIn = validateCheckIn;
