const Joi = require("joi-oid");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Schema
const schemaUser = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 125,
    },
    first_name: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 2,
      maxlength: 125,
      index: true,
    },
    last_name: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 2,
      maxlength: 125,
      index: true,
    },
    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female", "other"],
      required: true,
    },
    phone_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    cnic: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    address: {
      type: String,
      lowercase: true,
      minlength: 2,
      maxlength: 225,
    },
    contract_durations: [
      {
        type: new mongoose.Schema(
          {
            employment_type: {
              type: String,
              lowercase: true,
              enum: ["permanent", "probation", "internship", "contract"],
            },
            start_date: {
              type: Date,
              default: Date.now,
            },
            end_date: {
              type: Date,
            },
          },
          { timestamps: true }
        ),
      },
    ],
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

//joi validation
function validateCreateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(255)
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().min(5).max(255).required(),
    is_admin: Joi.boolean().default(false),
    title: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    phone_number: Joi.string()
      .pattern(/^\+\d{12}$|^\d{11}$|^\d{4}-\d{7}$/)
      .optional()
      .allow(null)
      .allow("")
      .empty(""), // +123456789012, 12345678901, 1234-5678901
    cnic: Joi.string()
      .length(13)
      .pattern(/^\d{13}$|^\d{5}-\d{7}-\d{1}$/)
      .optional()
      .allow(null)
      .allow("")
      .empty(""), // 1234567890123, 12345-6789012-3
    address: Joi.string().optional().allow(null).allow("").empty(""),
    employment_type: Joi.string().valid(
      "permanent",
      "probation",
      "internship",
      "contract"
    ),
    start_date: Joi.when("employment_type", {
      is: Joi.string().valid("permanent").required(),
      then: Joi.date().default(Date.now),
      otherwise: Joi.date().required(),
    }),
    end_date: Joi.when("employment_type", {
      is: Joi.string().valid("permanent").required(),
      then: Joi.date(),
      otherwise: Joi.date().required(),
    }),

    added_by: Joi.objectId(),
  });
  return schema.validate(user);
}

function validateUpdateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(255)
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    title: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    phone_number: Joi.string()
      .pattern(/^\+\d{12}$|^\d{11}$|^\d{4}-\d{7}$/)
      .optional()
      .allow(null)
      .allow("")
      .empty(""), // +123456789012, 12345678901, 1234-5678901
    cnic: Joi.string()
      .length(13)
      .pattern(/^\d{13}$|^\d{5}-\d{7}-\d{1}$/)
      .optional()
      .allow(null)
      .allow("")
      .empty(""), // 1234567890123, 12345-6789012-3
    address: Joi.string().optional().allow(null).allow("").empty(""),
    updated_by: Joi.objectId(),
  });
  return schema.validate(user);
}
function validateContractDuration(duration) {
  const schema = Joi.object({
    contract_durations: Joi.array()
      .min(1)
      .required()
      .items(
        Joi.object({
          employment_type: Joi.string()
            .valid("permanent", "probation", "internship", "contract")
            .required(),
          start_date: Joi.date().when("employment_type", {
            is: Joi.string().valid("permanent").required(),
            then: Joi.optional().allow(null).allow("").empty(""),
            otherwise: Joi.date().required(),
          }),
          end_date: Joi.date().when("employment_type", {
            is: Joi.string().valid("permanent").required(),
            then: Joi.forbidden(),
            otherwise: Joi.date().required(),
          }),
        })
      )
      .custom((contractDurations) => {
        for (let i = 0; i < contractDurations.length; i++) {
          const contractDuration = contractDurations[i];

          if (contractDuration.employment_type !== "permanent") {
            const startDate = new Date(contractDuration.start_date);
            const endDate = new Date(contractDuration.end_date);

            if (startDate >= endDate) {
              throw new Joi.ValidationError(
                `End date must be after start date at index ${i}`
              );
            }

            if (i > 0) {
              const prevEndDate = new Date(contractDurations[i - 1].end_date);

              if (startDate < prevEndDate) {
                throw new Joi.ValidationError(
                  `Start date must be after the end date of the previous contract duration at index ${i}`
                );
              }
            }
          }
        }

        return contractDurations;
      }),
    updated_by: Joi.objectId(),
  });

  return schema.validate(duration);
}

const Users = mongoose.model("User", schemaUser);
schemaUser.plugin(uniqueValidator);
exports.Users = Users;
exports.validateCreateUser = validateCreateUser;
exports.validateUpdateUser = validateUpdateUser;
exports.validateContractDuration = validateContractDuration;
