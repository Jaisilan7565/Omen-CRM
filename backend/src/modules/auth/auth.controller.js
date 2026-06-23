const authService = require('./auth.service');
const ApiResponse = require('../../common/api/ApiResponse');
const ApiError = require('../../common/api/ApiError');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    new ApiResponse(200, true, 'Login successful', result).send(res);
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    // req.user will be populated by the auth middleware
    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'Unauthorized access');
    }
    const profile = await authService.getUserProfile(req.user.id);
    new ApiResponse(200, true, 'Authenticated user fetched successfully', profile).send(res);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    new ApiResponse(200, true, 'Logged out successfully').send(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  me,
  logout
};
