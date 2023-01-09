exports.validator = {
  // User
  name: "First and last name must both be between 3-50 characters",
  email: "Please enter a valid email",
  uniqueEmail: "This email already exists",
  password: "Password between 8-12 characters. Must contain letter password, with at least a symbol, upper and lower case letters and a number",
  validUser: "Please enter a valid user",
  nonAdmin: "This action is only permitted for admin",
  roles: "please choose a valid role [contractor, jr. contractor, school, council]",

  // Report
  grade: "Please enter a valid grade: [A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F+, F, F-]",
  description: "The description must be between 0 and 250 characters",
  invalidAccessToUpdateReport: "You do not have the required access to update this report",
  
}