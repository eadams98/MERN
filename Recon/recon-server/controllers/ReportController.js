const ReportModel = require("../models/ReportModel")
const Helper = require('../utilities/helper')
const Validator = require('../utilities/validator')
const ErrorMapping = require('../utilities/errorMapping')

const schemaName = 'users'

exports.createReport = async (req, res, next) => {
  const { grade, week, description, user } = req.body
  if (Helper.isMissingParams({"grade": grade, "week": week, "description": description, "user": user}, next)) {
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

    const newReport = {
      grade: grade,
      submissionDate: new Date(new Date().toDateString()),
      forWeek: week,
      description: description,
      user: user
    }

    const dbResponse = await ReportModel.create(newReport)
    console.log(dbResponse)

    res.status(200).json({
      status: "success",
      data: `Succussfully created report for week ${week.start} - ${week.end}. Submitted ${newReport.submissionDate}`
    })

  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}