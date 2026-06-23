const ApiError = require('../api/ApiError');
const { verifyToken } = require('../utils/jwt.util');
const db = require('../../database/models');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Unauthorized: Access token is missing');
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      throw new ApiError(401, 'Unauthorized: Invalid or expired token');
    }

    // Verify user still exists and is active
    const user = await db.Contact.findByPk(decoded.id);

    if (!user) {
      throw new ApiError(401, 'Unauthorized: User no longer exists');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Forbidden: User account is suspended');
    }

    // Since roles are decoupled from general contacts database, 
    // we assign roles dynamically based on email (e.g. Platform Admin)
    const roles = user.email === 'jaisilan@gmail.com' ? ['PLATFORM_ADMIN', 'ADMIN'] : [];

    // Attach user information to request
    req.user = {
      id: user.id,
      email: user.email,
      roles: roles
    };

    next();
  } catch (error) {
    next(error);
  }
};

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return next(new ApiError(401, 'Unauthorized: Missing user credentials'));
    }

    const hasRole = req.user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return next(new ApiError(403, 'Forbidden: You do not have permission to perform this action'));
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
