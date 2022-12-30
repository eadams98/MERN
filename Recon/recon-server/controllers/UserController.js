require('dotenv').config()
const UserModel = require("../models/UserModel")
const jwt = require('jsonwebtoken');
const Helper = require('../utilities/helper')
const Validator = require('../utilities/validator')
const ErrorMapping = require('../utilities/errorMapping')

let refreshTokens = [] // possibly many users, so this will hold
const schemaName = 'users'

exports.register = async (req, res, next) => {
  const { email, password, name, role, userID } = req.body
  if (Helper.isMissingParams({"email": email, "password": password, "name": name, "role": role, "userID": userID}, next)) {
    return
  }

  try {
    const failedValidattions = []
    if (!(await Validator.isValidUser(userID))) {
      failedValidattions.push(ErrorMapping.validator.validUser + ". ")
    } else {
      if (!(await Validator.isAdminUser(userID))) {
        failedValidattions.push(ErrorMapping.validator.nonAdmin + ". ")
      } else {
        if (!Validator.isValidName(name)) {
          failedValidattions.push(ErrorMapping.validator.name + ". ")
        }
        if (!Validator.isValidPassword(password)) {
          failedValidattions.push(ErrorMapping.validator.password + ". ")
        }
        if (!Validator.isValidEmail(email)) {
          failedValidattions.push(ErrorMapping.validator.email + ". ")
        }
        if (!Validator.isValidUserRole(role)) {
          failedValidattions.push(ErrorMapping.validator.roles + ". ")
        }
        if (!(await Validator.isUniqueEmail(email))) {
          failedValidattions.push(ErrorMapping.validator.uniqueEmail + ". ")
        }
      }
    }

    if (failedValidattions.length > 0) {
      res.status(400).json({
        status: "fail",
        message: `please fix these ${failedValidattions}`
      })
      return
    }

    const counter = await Helper.getCounter(schemaName)
    const formattedGeneratedUserNumber = Helper.zeroPad(counter, 3)

    let newUser = {
      userID: `UID-${formattedGeneratedUserNumber}`,
      emailID: email,
      password: password,
      name: name,
      role: role,
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
          refreshToken: refreshToken,
          name: dbResponse.name,
          ID: dbResponse.userID
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

exports.checkRefreshToken = async (req, res, next) => {
  const { token }  = req.body
  if (Helper.isMissingParams({"token": token}, next)) {
    return
  }
  if(!refreshTokens.includes(token)) {
    return res.status(403).json({
      status: 'fail',
      message: "Refresh token not recognized/found"
    })
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function(err, decodedUser) {
    if (err) {
      /*
        err = {
          name: 'TokenExpiredError',
          message: 'jwt expired',
          expiredAt: 1408621000
        }
      */
      res.status(400).json({
        status: 'fail',
        data: err
      })
      return
    } else {
      res.status(200).json({
        status: 'success',
        data: Helper.generateAccessToken({name: decodedUser.name})
      })
      return
    } 
  });
  
}

