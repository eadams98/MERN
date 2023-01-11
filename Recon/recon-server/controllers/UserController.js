require('dotenv').config()
const UserModel = require("../models/UserModel")
const jwt = require('jsonwebtoken');
const Helper = require('../utilities/helper')
const Validator = require('../utilities/validator')
const ErrorMapping = require('../utilities/errorMapping');

let refreshTokens = [] // possibly many users, so this will hold
const schemaName = 'users'

exports.register = async (req, res, next) => {
  const { email, password, name, role, userID } = req.body
  const { user } = req
  console.log(req, user)
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

    const schemaNameWithRole = `${schemaName}-${role.toLowerCase()}`
    const counter = await Helper.getCounter(schemaNameWithRole)
    const formattedGeneratedUserNumber = Helper.zeroPad(counter, 3)

    const UserRoleToUserIDPrefixMapping = {
      school: "SCHOOL",
      council: "COUNCIL",
      contractor: "CONTRACTOR",
      "jr. contractor": "JR-CONTRACTOR",
    }
    let newUser = {
      userID: `${UserRoleToUserIDPrefixMapping[role.toLowerCase()]}-${formattedGeneratedUserNumber}`,
      emailID: email,
      password: password,
      name: name,
      role: role.toUpperCase(),
    }
    const dbResponse = await UserModel.create(newUser)
    await Helper.incrementCounter(schemaNameWithRole, counter)

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
      { name: 1,  role: 1, access: 1, userID: 1, userImage: 1 }
    )

    if (dbResponse) {
      dbResponse.exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
      const accessToken = jwt.sign({ userID: dbResponse.userID, role: dbResponse.role, access: dbResponse.access, exp: Math.floor(Date.now() / 1000) + 60 }, process.env.ACCESS_TOKEN_SECRET )
      const refreshToken = jwt.sign( dbResponse.toJSON(), process.env.REFRESH_TOKEN_SECRET )
      refreshTokens.push(refreshToken)

      let PORT;
      process.env.STATUS == 'production' ?
        PORT = process.env.PROD_PORT :
        PORT = process.env.DEV_PORT
      const profileURL = dbResponse?.userImage ? 
        `http://localhost:${PORT}/${dbResponse.userImage}` :
        ""

      res.status(200).json({
        status: "success",
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          name: dbResponse.name,
          ID: dbResponse.userID,
          role: dbResponse.role,
          access: dbResponse.access,
          profilePicture: profileURL
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

exports.logout = async (req, res, next) => {
  const { token } = req.body
  if (Helper.isMissingParams({"token": token}, next)) {
    return
  }

  const refreshTokenLengthBeforeFilter = refreshTokens.length
  refreshTokens = refreshTokens.filter(token => token != req.body.token)

  if (refreshTokens.length < refreshTokenLengthBeforeFilter) {
    res.status(200).json({
      status: 'success',
      data: 'refesh token removed'
    })
  } else {
    res.status(401).json({
      status: 'fail',
      data: 'No refresh token found'
    })
  }
  
}

exports.getProfile = async (req, res, next) => {
  try {
    const myProfile = await UserModel.findOne({ userID: req.user.userID})
    const returnData = { 
      name: { first: myProfile.name.first, last: myProfile.name.last },
      email: myProfile.emailID,
      role: myProfile.role
    }

    switch(req.user.role) {
      case "CONTRACTOR":
        const jrContractors = []
        const regex = /^JR-CONTRACTOR-[0-9]{3,}$/
        for (const userID of myProfile.connections) {
          try {
            let user = await UserModel.findOne({ userID: userID}, { name: 1, emailID: 1, connections: 1 })
            if (user) {
              const schoolID = user.connections.find(userID => /^SCHOOL-[0-9]{3,}$/.test(userID))
              let school
              if (schoolID) { school = await UserModel.findOne({ userID: schoolID }, { name: 1 }) }
              jrContractors.push({ name: `${user.name.first} ${user.name.last}`, email: user.emailID, school: school ? `${school.name.first} ${school.name.first}` : `no school` , avgGrade: "N/A" })
            }
          } catch (error) {
            // pass
          }
        }
        returnData.connections = jrContractors
        break
      case "JR. CONTRACTOR":
        const contractors = []
        for (const userID of myProfile.connections) {
          try {
            if (/^CONTRACTOR-[0-9]{3,}$/.test(userID)) {
              let user = await UserModel.findOne({ userID: userID}, { name: 1, emailID: 1 })
              contractors.push({ name: `${user.name.first} ${user.name.last}`, email: user.emailID, avgRating: "N/A" })
            }
          } catch (error) {
            // pass
          }
        }
        break
      default:

    }

    res.status(200).json({
      status: 'success',
      data: returnData
    })
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.updateProfile = async (req, res, next) => {
  const { email, name } = req.body
  if (Helper.isMissingParams({"name": name, "email": email}, next)) {
    return 
  }

  const { first, last } = req.body.name
  if (Helper.isMissingParams({"first": first, "last": last}, next)) {
    return 
  }

  try {
    const failedValidattions = []
    if (!(await Validator.isValidEmail(email))) {
      failedValidattions.push(ErrorMapping.validator.email + ". ")
    }
    if ( !Validator.isValidName(name) ) {
      failedValidattions.push(ErrorMapping.validator.name)
    }

    if (failedValidattions.length > 0) {
      res.status(400).json({
        status: "fail",
        message: `please fix these ${failedValidattions}`
      })
      return
    }

    const dbResponse = await UserModel.findOneAndUpdate( {userID: req.user.userID}, { $set: { name: name, emailID: email } }, {
      returnNewDocument: true
  } )
    console.log(req.user.userID)

    res.status(200).json({
      status: 'success',
      data: 'successfully updated'
    })
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.checkRefreshTokenAndGenerateNewAccessToken = async (req, res, next) => {
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
    console.log(decodedUser)
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
        data: Helper.generateAccessToken({ userID: decodedUser.userID, role: decodedUser.role, access: decodedUser.access, exp: Math.floor(Date.now() / 1000) + 60 })
      })
      return
    } 
  });
  
}

exports.uploadProfilePicture = async (req, res, next) => {
  console.log(req.file)
  try {
    await UserModel.findOneAndUpdate(
      { userID: req.user.userID },
      { $set: {  userImage: req.file.path } }
    )
    res.status(200).json({
      status: 'success',
      data: 'picture successfully uploaded'
    })
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.addConnectionToSelf = async (req, res, next) => { // should only be used by school, contractor, council
  const { userIDToAdd } = req.body;
  if (Helper.isMissingParams({"userIDToAdd": userIDToAdd}, next)) {
    return 
  }

  try {
    const failedValidattions = []
    if (!(await Validator.isValidUser(userIDToAdd))) {
      failedValidattions.push(ErrorMapping.validator.validUser + ". ")
    } else {
      if (!(await Validator.isValidRole(userIDToAdd, req.user.role))) {
        failedValidattions.push("You do not have the access to add this connection" + ". ")
      }
      /*
      1. if not already in each others connection list
      2. 
      */
    }
  
    if (failedValidattions.length > 0) {
      res.status(400).json({
        status: "fail",
        message: `please fix these ${failedValidattions}`
      })
      return
    }

    let dbResponse = await UserModel.findOneAndUpdate(
      {userID: req.user.userID},
      {$push: {connections: userIDToAdd}}
    )
    dbResponse = await UserModel.findOneAndUpdate(
      {userID: userIDToAdd},
      {$push: {connections: req.user.userID}}
    )

    res.status(200).json({
      status: "success",
      data: "connection added"
    })
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.getMyConnections = async (req, res, next) => {
  try {
    const dbResponse = await UserModel.findOne({userID: req.user.userID}, {connections: 1, _id: 0})
    res.status(200).json({
      status: 'status',
      data: dbResponse.connections
    })
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.getMyJrContractors = async (req, res, next) => {
  try {
    const dbResponse = await UserModel.findOne({ userID: req.user.userID}, { connections: 1, _id: 0 })
    const regex = /^JR-CONTRACTOR-[0-9]{3,}$/
    const responseData = []

    for (const connection of dbResponse.connections) {
      let user
      if (regex.test(connection)) {
        user = await UserModel.findOne({ userID: connection }, { _id: 0, name: 1, userID: 1, emailID: 1 })
        console.log(user)
        if (user) { responseData.push({ userID: user.userID, name: `${user.name.first} ${user.name.last}`, email: user.emailID }) }
      }
    }
    console.log(responseData)
    res.status(200).json(responseData)
  } catch (error) {
    next(Helper.generateError(400, error.message))
  }
}

exports.getUserNameAndUserIDByUserID = async (userID) => {
  try {
    const dbResponse = await UserModel.findOne({ userID: userID })
    console.log("user found", dbResponse)
    const userWithIDandName = { userID: dbResponse.userID, name: `${dbResponse.name.first.trim()} ${dbResponse.name.last.trim()}` }
    return userWithIDandName
  } catch (error) {
    return "error"
  }
}