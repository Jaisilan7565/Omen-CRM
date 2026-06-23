const jwt = require('jsonwebtoken');
const env = require('../../config/env');

const generateToken = (payload) => {
  // jwtExpiresIn is parsed as integer in env.js. We can use it directly or pass it to jwt.sign
  // Note: if it's a number, jwt expects it in seconds.
  const expiresIn = env.jwtExpiresIn || 86400;
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken
};
