// Models
const ReportModel = require("../models/ReportModel");
const UserModel = require("../models/UserModel")

// User Validators
exports.isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailRegex.test(email)) {
    return true
  }
  return false
}

exports.isUniqueEmail = async (email) => {
  try {
    if (await UserModel.findOne({ emailID: email })) { return false }
    return true
  } catch (error) {
    return false
  }
}

exports.isValidName = (name) => { 
  if ( 
    name?.first && name?.last &&
    (name.first.length >= 3 && name.first?.length <= 50) && 
    (name?.last?.length >= 3 && name?.last?.length <= 50) 
  ) {
    return true
  }
  return false
}

exports.isValidPassword = (password) => {
  // min 8, max 12 letter password, with at least a symbol, upper and lower case letters and a number
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/
  if (passwordRegex.test(password)) {
    return true
  }
  return false
}

exports.isValidRole = async (userID, role) => { // WORK IN PROGRESS
  try { //Council, School, Contractor, Jr. contractor
    const validConnectionsForRole = {
      school: new Set(["jr. contractor"]),
      council: new Set(["jr. contractor"]),
      contractor: new Set(["jr. contractor"]),
      "jr. contractor": new Set(["contractor", "school"]),
    }
  
    const user = await UserModel.findOne({ userID: userID })
    console.log(userID, role, user.role.toLowerCase(), validConnectionsForRole)
    if ( user && validConnectionsForRole[role.toLowerCase()].has(user.role.toLowerCase()) ) {return true}
    return false
  } catch (error) {
    return false
  }
}

// Report Validator
exports.isValidGrade = (grade) => {
  const GRADES = new Set([
    "A+", "A", "A-",
    "B+", "B", "B-",
    "C+", "C", "C-",
    "D+", "D", "D-",
    "F+", "F", "F-",
  ])

  if (GRADES.has(grade)) {
    return true
  }
  return false
}

exports.isValidDescription = (description) => {
  if (description.length >=  0 && description.length <= 250) {
    return true
  }
  return false
}

exports.isValidUser = async (user) => {
  if (await UserModel.findOne({ userID: user })) {
    return true
  }
  return false
}

exports.isAdminUser = async (user) => {
  const foundUser = await UserModel.findOne({ userID: user })
  if (foundUser && foundUser.role === "ADMIN") {
    return true
  }
  return false
}

exports.isValidUserRole = (role) => {
  const ROLES = new Set(["contractor", "jr. contractor", "school", "council"])
  const lowercaseRole = `${role}`.toLowerCase()
  if (ROLES.has(lowercaseRole)) {
    return true
  }
  return false
}

exports.isAuthorizedToUpdateReport = async (reportID, role, userID) => {
  // _id will crash if you don't provide 12 24 value. Fix is to check before query
  if (role === "ADMIN") { return true }
  const foundReport = await ReportModel.findOne({ _id: reportID })
  if (foundReport && (foundReport.createdByUser === userID || foundReport.createdForUser === userID)) { return true }
  return false
}

// error mappings
/*exports.missingFieldMapping = {
  email: "",
  password: ,
  name: ,
}*/