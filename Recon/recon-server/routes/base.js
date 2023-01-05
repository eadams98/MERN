require('dotenv').config()

var express = require('express');
const routing = express.Router();
const helper = require('../utilities/helper')
const { router } = require('../app');


// Controllers
const UserController = require("../controllers/UserController")
const ReportController = require("../controllers/ReportController")
const tokenChecker = require('../middlewares/tokenChecker');

// helpers

// routes
routing.get("/get-my-connections", tokenChecker, UserController.getMyConnections)
routing.post("/login", UserController.login)
routing.post("/register", tokenChecker, UserController.register)
routing.post("/add-connection-to-self", tokenChecker, UserController.addConnectionToSelf)
routing.post("/generate-token", UserController.checkRefreshTokenAndGenerateNewAccessToken)
routing.delete("/logout", UserController.logout)

routing.post("/create-report", tokenChecker, ReportController.createReport)
routing.get("/get-my-users", tokenChecker, ReportController.getMyUsers)
routing.get("/get-my-submitted-reports/:userID", tokenChecker, ReportController.getMySubmittedReportsForUser)
routing.post("/get-contractor-report", tokenChecker, ReportController.getReportForContractorByWeekAndCreatedByAndCreatedFor)
routing.post("/get-jr-contractor-report", tokenChecker, ReportController.getReportForJrContractorByWeekAndCreatedByAndCreatedFor)


routing.all("*", async (req, res, next) => {
  res.status(404).json({
    data: "invalid route"
  })
})

module.exports = routing;