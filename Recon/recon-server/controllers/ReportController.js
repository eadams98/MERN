const UserController = require("../controllers/UserController")

const ReportModel = require("../models/ReportModel")
const Helper = require('../utilities/helper')
const Validator = require('../utilities/validator')
const ErrorMapping = require('../utilities/errorMapping')

const schemaName = 'users'

exports.createReport = async (req, res, next) => {
  console.log("REQ BELLOW")
  console.log(req)
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
      createdByUser: req.user.userID,
      createdForUser: user
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

exports.getMyUsers = async (req, res, next) => {
  try {
    const dbResponse = await ReportModel.find({ createdByUser: req.user.userID }) // make it unique. no duplicat createdForUser
    const userList = []
    console.log(dbResponse)
    for (const report of dbResponse) {
      const user = await UserController.getUserNameAndUserIDByUserID(report.createdForUser)
      console.log("added to list")
      userList.push(user)
    }

    res.status(200).json(userList)
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.getMySubmittedReportsForUser = async (req, res, next) => {
  const { userID } = req.params

  try {
    const dbResponse = await ReportModel.find({ createdByUser: req.user.userID, createdForUser: userID }) // make it unique. no duplicat createdForUser
    const weekRange = []
    
    dbResponse.forEach( report => {console.log("report", report); weekRange.push(`${new Date(report.forWeek.start).toUTCString()} - ${new Date(report.forWeek.end).toUTCString()}`);})

    res.status(200).json(weekRange)
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.getReportForContractorByWeekAndCreatedByAndCreatedFor = async (req, res, next) => {
  const { week, createdFor } = req.body
  if (Helper.isMissingParams({"week": week, "createdFor": createdFor}, next)) {
    return
  }

  try {
    console.log("past")
    const weekList = week.split(" - ");
    const startDate = new Date(weekList[0])
    const endDate = new Date(weekList[1])
    console.log(startDate, endDate)
    const dbResponse = await ReportModel.findOne({ createdByUser: req.user.userID, createdForUser: createdFor, forWeek: { start: startDate, end: endDate } })
    res.status(200).json(dbResponse)
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.getReportForJrContractorByWeekAndCreatedByAndCreatedFor = async (req, res, next) => {
  const { week } = req.body
  if (Helper.isMissingParams({"week": week}, next)) {
    return
  }

  try {
    console.log("past")
    const weekList = week.split(" - ");
    const startDate = new Date(weekList[0])
    const endDate = new Date(weekList[1])
    console.log(startDate, endDate)
    const dbResponse = await ReportModel.findOne({ createdForUser: req.user.userID, forWeek: { start: startDate, end: endDate } })
    res.status(200).json(dbResponse)
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

