// Models
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
  if (!name?.first && !name?.last) { 
    return false
  }
  if (name?.length >= 3 && name?.length <= 50) {
    return true
  }
  return true
}

exports.isValidPassword = (password) => {
  // min 8, max 12 letter password, with at least a symbol, upper and lower case letters and a number
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/
  if (passwordRegex.test(password)) {
    return true
  }
  return false
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

// error mappings
/*exports.missingFieldMapping = {
  email: "",
  password: ,
  name: ,
}*/