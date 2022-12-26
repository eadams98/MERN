require('dotenv').config()
const jwt = require('jsonwebtoken');
const fs = require('fs');
const CounterModel = require('../models/counterSchema');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) { res.status(401); res.json({ message: "Token not available" }) }
  else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) { res.status(403); res.json({ message: "User is not Authenticated" }) }
      else {
        req.user = user;
        next();
      }
    })
  }
};

exports.zeroPad = (num, numZeros) => {
  const n = Math.abs(num);
  const zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
  let zeroString = (10 ** zeros).toString().substr(1);
  if (num < 0) {
    zeroString = `-${zeroString}`;
  }

  return zeroString + n;
};

exports.generateError = (status, msg) => {
  const generatedError = new Error();
  generatedError.status = status;
  generatedError.message = msg;
  return generatedError
};

exports.isMissingParams = (paramObj, next) => {
  const missingFields = []
  let paramName;
  console.log(paramObj)

  for (let [key,value] of Object.entries(paramObj)) {
    console.log(`key: ${key}, value: ${value}`)
    if (!value) {
      console.log(value)
      missingFields.push(key)
    }
  }
  console.log(missingFields)
  if (missingFields.length > 0) {
    next(this.generateError(
      400,
      `Please specify the missing fields in the body: ${missingFields}`
    ))
    return true
  }
  return false
}

exports.getCounter = async (schemaName) => {
  const counterDbResponse = await CounterModel.findOne({
    schemaName: schemaName
  });

  if (counterDbResponse) {
    return counterDbResponse.counter;
  }

  const newCounterSchema = {
    schemaName: schemaName
  };
  await CounterModel.create(newCounterSchema);
  return 1;
}

exports.incrementCounter = async (schemaName, counterValue) => {
  const counterDbResponse = await CounterModel.findOneAndUpdate(
    { schemaName: schemaName },
    { counter: counterValue + 1 },
    { runValidators: true, new: true }
  );

  return counterValue + 1
}