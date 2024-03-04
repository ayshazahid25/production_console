const asyncHandler = require("express-async-handler");
const { validateWorkingHourRules } = require("../../models/workingHourRules");
const { expressValidatorError } = require("../../middleware/commonMiddleware");
const {
  addWorkingHourRulesMiddleware,
  getAllWorkingHourRuleMiddleware,
  getWorkingHourRuleIdMiddleware,
  ruleUpdation,
  disableWorkingHourRules,
  ruleApplication,
  removeRuleMiddleware,
  findWorkingHourRuleById,
} = require("./workingHourRulesHelper");
const { default: mongoose } = require("mongoose");

// @desc Create working hour rule
// @route POST /api/working_hour_rules
// @access Public
const createWorkingHourRule = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }
  //validate requested data
  expressValidatorError(req);
  const rules = req.body;

  try {
    rules.added_by = req.result._id.toString();

    if (rules) {
      const { error } = validateWorkingHourRules(rules);

      if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
      }
    }
    //insert into db
    const workOnRuleCreated = await addWorkingHourRulesMiddleware(rules);

    if (!workOnRuleCreated) {
      res.status(400);
      throw new Error("Unable to create working hour rules");
    }

    return res
      .status(200)
      .json({ message: "Working hour rules created successfully" });
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
          ? "Something went wrong while creating working hour rules: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get all rules
// @route GET /api/working_hour_rules/all
// @access Private
const getAllWorkingHourRule = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  try {
    //get all rules
    const rules = await getAllWorkingHourRuleMiddleware();

    if (!rules) {
      res.status(400);
      throw new Error("No rule found!");
    }

    res.status(200).json({
      rules,
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
          ? "Something went wrong while fetching working hour rules: "
          : ""
      }${error.message}`
    );
  }
});

// @desc get rule by id
// @route GET /api/working_hour_rules/:id
// @access Private
const getWorkingHourRuleById = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);

  try {
    const rule = await getWorkingHourRuleIdMiddleware(req.params.id);

    if (!rule || rule.length === 0) {
      res.status(400);
      throw new Error("Working hour rule don't exist");
    }

    res.status(200).json({
      rule,
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
          ? "Something went wrong while fetching working hour rule data: "
          : ""
      }${error.message}`
    );
  }
});

// @desc apply working hour rule
// @route POST /api/working_hour_rules/apply/:id
// @access Private
const applyWorkingHourRule = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);

  const rule = new Object();
  rule.applied = true;
  rule.updated_by = req.result._id.toString();

  //transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // check if working hour rule exist with param id
    const ruleExists = await findWorkingHourRuleById(req.params.id);

    if (!ruleExists) {
      res.status(400);
      throw new Error("Working hour rule doesn't exists");
    }

    //find any applied rule and make it false
    const disableRule = await disableWorkingHourRules(session);

    //check if rule exist with param id then apply it
    const appliedRule = await ruleApplication(req.params.id, rule, session);

    if (!appliedRule) {
      res.status(400);
      throw new Error(
        "Unable to apply working hour rule. Rollback occur during updating rule"
      );
    }
    await session.commitTransaction();

    return res
      .status(200)
      .json({ message: "Working hour rule applied successfully!" });
  } catch (error) {
    await session.abortTransaction();
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
          ? `Something went wrong while applying working hour rule: `
          : ""
      }${error.message}`
    );
  }
});

// @desc remove working hour rule
// @route POST /api/working_hour_rules/delete/:id
// @access Private
const removeWorkingHourRule = asyncHandler(async (req, res) => {
  if (!req.result.is_admin) {
    res.status(400);
    throw new Error("You are not allowed to perform this action");
  }

  //validate input data
  expressValidatorError(req);

  try {
    //remove rule with sepecific id
    const removedRule = await removeRuleMiddleware(req.params.id);
    if (!removedRule) {
      res.status(400);
      throw new Error("Unbale to delete working hour rule.");
    }

    return res
      .status(200)
      .json({ message: "Working hour rule deleted successfully!" });
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
          ? `Something went wrong while deleting working hour rule: `
          : ""
      }${error.message}`
    );
  }
});
module.exports = {
  createWorkingHourRule,
  getAllWorkingHourRule,
  getWorkingHourRuleById,
  applyWorkingHourRule,
  removeWorkingHourRule,
};
