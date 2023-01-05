const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req,res,next) => {
  console.log(req.headers.authorization)
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req?.headers['authorization']?.split("Bearer ")[1]
  console.log(token)
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decodedUser) {
      console.log(decodedUser)
        if (err) {
            return res.status(401).json({
              status: 'fail',
              data: err
            });
        }
      req.user = decodedUser;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }
}