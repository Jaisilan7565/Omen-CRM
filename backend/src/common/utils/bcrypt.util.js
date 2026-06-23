const bcrypt = require('bcrypt');
const env = require('../../config/env');

const hashPassword = async (password) => {
  const saltRounds = parseInt(env.bcryptSaltRounds, 10) || 10;
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};
