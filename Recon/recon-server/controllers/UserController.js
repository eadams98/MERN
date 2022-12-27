require('dotenv').config()
const UserModel = require("../models/UserModel")
const jwt = require('jsonwebtoken');
const Helper = require('../utilities/helper')
const Validator = require('../utilities/validator')
const ErrorMapping = require('../utilities/errorMapping')

let refreshTokens = [] // possibly many users, so this will hold
const schemaName = 'users'

exports.register = async (req, res, next) => {
  console.log("register")
  const { email, password, name, role } = req.body
  if (Helper.isMissingParams({"email": email, "password": password, "name": name}, next)) {
    return
  }

  try {
    const failedValidattions = []
    if (!Validator.isValidName(name)) {
      failedValidattions.push(ErrorMapping.validator.name + ". ")
    }
    if (!Validator.isValidPassword(password)) {
      failedValidattions.push(ErrorMapping.validator.password + ". ")
    }
    if (!Validator.isValidEmail(email)) {
      failedValidattions.push(ErrorMapping.validator.email + ". ")
    }
    if (!(await Validator.isUniqueEmail(email))) {
      failedValidattions.push(ErrorMapping.validator.uniqueEmail + ". ")
    }

    if (failedValidattions.length > 0) {
      res.status(400).json({
        status: "fail",
        message: `please fix these ${failedValidattions}`
      })
      return
    }

    const counter = await Helper.getCounter(schemaName)
    const userID = Helper.zeroPad(counter, 3)

    let newUser = {
      userID: `UID-${userID}`,
      emailID: email,
      password: password,
      name: name,
      role: "Admin"
    }
    const dbResponse = await UserModel.create(newUser)
    await Helper.incrementCounter(schemaName, counter)

    res.status(200).json({ status: "success", data: dbResponse})
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.login = async (req, res, next) => {
  //setTimeout(async () => {
  const { email, password } = req.body;
  if (Helper.isMissingParams({"email": email, "password": password}, next)) {
    return
  }

  try {
    const dbResponse = await UserModel.findOne(
      { emailID: email, password: password },
      { name: 1,  role: 1, access: 1, userID: 1 }
    )

    if (dbResponse) {
      dbResponse.exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
      const accessToken = jwt.sign({ name: dbResponse.userID, exp: Math.floor(Date.now() / 1000) + 60 }, process.env.ACCESS_TOKEN_SECRET )
      const refreshToken = jwt.sign( dbResponse.toJSON(), process.env.REFRESH_TOKEN_SECRET )
      refreshTokens.push(refreshToken)
      res.status(200).json({
        status: "success",
        data: {
          accesToken: accessToken,
          refreshToken: refreshToken
        }
      })
      return
    }
    
    res.status(404).json({
      status: "failed",
      message: "Login Failed. Incorrect ID/Password please try again"
    })

  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
//}, 10000)
}
