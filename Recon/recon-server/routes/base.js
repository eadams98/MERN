require('dotenv').config()

var express = require('express');
const routing = express.Router();
const helper = require('../utilities/helper')
const { router } = require('../app');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './profile-pictures/');
  },
  filename: function(req, file, cb) {
    cb(null, `${req.user.userID}.jpg`)
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // accept 
  }
  cb(null, false) // reject a file (ignores file no save)
  
}
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB,
  fileFilter: fileFilter
}) 

// Controllers
const UserController = require("../controllers/UserController")
const ReportController = require("../controllers/ReportController")
const tokenChecker = require('../middlewares/tokenChecker');

// helpers

// routes
routing.get("/get-my-connections", tokenChecker, UserController.getMyConnections)
routing.get("/get-profile", tokenChecker, UserController.getProfile)
routing.get("/get-school-students", tokenChecker, UserController.getSchoolStudents);
routing.put("/update-profile", tokenChecker, UserController.updateProfile)
routing.post("/login", UserController.login)
routing.post("/register", tokenChecker, UserController.register)
routing.post("/upload-profile-photo", tokenChecker, upload.single(`profileImage`), UserController.uploadProfilePicture)
routing.post("/add-connection-to-self", tokenChecker, UserController.addConnectionToSelf)
routing.post("/generate-token", UserController.checkRefreshTokenAndGenerateNewAccessToken)
routing.get("/get-my-jr-contractors", tokenChecker, UserController.getMyJrContractors)
routing.delete("/logout", UserController.logout)

routing.post("/create-report", tokenChecker, ReportController.createReport)
routing.get("/get-my-report-weeks", tokenChecker, ReportController.getMyReportWeeks)
routing.get("/get-my-users-with-reports", tokenChecker, ReportController.getMyUsersWithReports)
routing.get("/get-my-submitted-reports/:userID", tokenChecker, ReportController.getMySubmittedReportsForUser)
routing.post("/get-contractor-report", tokenChecker, ReportController.getReportForContractorByWeekAndCreatedByAndCreatedFor)
routing.post("/get-jr-contractor-report", tokenChecker, ReportController.getReportForJrContractorByWeekAndCreatedByAndCreatedFor)
routing.put("/update-report", tokenChecker, ReportController.updateReport)


routing.all("*", async (req, res, next) => {
  res.status(404).json({
    data: "invalid route"
  })
})

module.exports = routing;