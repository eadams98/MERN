const fs = require("fs")

const errorLogger = (err, req, res, next) => {
  if (err) {
    console.log(`${new Date().toDateString()} - ${err.message}`)
    fs.appendFile(
      "Errorlogger.txt",
      `${new Date().toDateString()} - ${err.message}`,
      (error) => {
        if (error) {
          console.log("logging failed");
        }
      }
    );

    if (err.status) {
      res.status(err.status);
    } else {
      res.status(500)
    }

    const status = err?.status ? err.status : 500

    res.status(status).json({
      message: err.message,
    });
  }
}

module.exports = errorLogger