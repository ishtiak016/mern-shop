const jwt = require('jsonwebtoken');

const createJsonWebToken = (payload, secretKey, expiresIn) => {
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

module.exports = createJsonWebToken;



