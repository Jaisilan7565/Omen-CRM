const ApiError = require('../api/ApiError');

const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, '')
    }));
    return next(new ApiError(400, 'Validation failed', errors));
  }

  // Replace req.body with the validated and stripped value
  req.body = value;
  next();
};

module.exports = validate;
