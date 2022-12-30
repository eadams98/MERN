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
routing.post("/login", UserController.login)
routing.post("/register", tokenChecker, UserController.register)
routing.post("/generate-token", UserController.checkRefreshToken)

routing.post("/create-report", tokenChecker, ReportController.createReport)

routing.all("*", (req, res, next) => {
  res.status(404).status({
    data: "invalid route"
  })
  return
})

module.exports = routing;