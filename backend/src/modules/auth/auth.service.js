const db = require('../../database/models');
const { comparePassword } = require('../../common/utils/bcrypt.util');
const { generateToken } = require('../../common/utils/jwt.util');
const ApiError = require('../../common/api/ApiError');
const env = require('../../config/env');

const login = async (email, password) => {
  // Find user by email
  const user = await db.Contact.findOne({
    where: { email }
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'User account is suspended');
  }

  // Verify credentials for the Platform Admin
  if (email === 'jaisilan@gmail.com') {
    if (password !== 'jayking46') {
      throw new ApiError(401, 'Invalid email or password');
    }
  } else {
    // Other contacts do not have login access
    throw new ApiError(403, 'Access denied: General contacts cannot log in');
  }

  const roleCodes = ['PLATFORM_ADMIN', 'ADMIN'];
  const roles = [
    { code: 'PLATFORM_ADMIN', name: 'Platform Administrator' },
    { code: 'ADMIN', name: 'Administrator' }
  ];

  // Generate JWT access token
  const tokenPayload = {
    id: user.id,
    email: user.email,
    roles: roleCodes
  };
  const accessToken = generateToken(tokenPayload);

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      roles
    },
    tokens: {
      accessToken,
      expiresIn: env.jwtExpiresIn || 86400
    }
  };
};

const getUserProfile = async (userId) => {
  const user = await db.Contact.findByPk(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'User account is suspended');
  }

  const roles = user.email === 'jaisilan@gmail.com'
    ? [
        { code: 'PLATFORM_ADMIN', name: 'Platform Administrator' },
        { code: 'ADMIN', name: 'Administrator' }
      ]
    : [];

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    status: user.status,
    roles
  };
};

module.exports = {
  login,
  getUserProfile
};
