const ReportModel = require("../models/ReportModel")
const Helper = require('../utilities/helper')
const Validator = require('../utilities/validator')
const ErrorMapping = require('../utilities/errorMapping')

const schemaName = 'users'

exports.createReport = async (req, res, next) => {
  const { grade, forWeek, description, user } = req.body
  if (Helper.isMissingParams({"grade": grade, "forWeek": forWeek, "description": description, "user": user}, next)) {
    return
  }

  try {
    const failedValidattions = []
    if (!Validator.isValidGrade(grade)) {
      failedValidattions.push(ErrorMapping.validator.grade)
    }
    if (!Validator.isValidDescription(description)) {
      failedValidattions.push(ErrorMapping.validator.description)
    }
    if (!(await Validator.isValidUser(user))) {
      failedValidattions.push(ErrorMapping.validator.validUser)
    }

    if (failedValidattions.length > 0) {
      res.status(400).json({
        status: "fail",
        data: `please fix these ${failedValidattions}`
      })
      return
    }


  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}