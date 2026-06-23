const accountsService = require('./accounts.service');
const { createAccountSchema, updateAccountSchema, listAccountsSchema } = require('./accounts.validation');
const ApiResponse = require('../../common/api/ApiResponse');
const ApiError = require('../../common/api/ApiError');

/**
 * GET /api/v1/accounts
 */
const list = async (req, res, next) => {
  try {
    const { error, value } = listAccountsSchema.validate(req.query, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const result = await accountsService.list(value);
    new ApiResponse(200, true, 'Accounts fetched', result).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/accounts/:id
 */
const getOne = async (req, res, next) => {
  try {
    const account = await accountsService.getById(req.params.id);
    new ApiResponse(200, true, 'Account fetched', account).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/accounts
 */
const create = async (req, res, next) => {
  try {
    const { error, value } = createAccountSchema.validate(req.body, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const account = await accountsService.create(value, req.user.id);
    new ApiResponse(201, true, 'Account created', account).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/accounts/:id
 */
const update = async (req, res, next) => {
  try {
    const { error, value } = updateAccountSchema.validate(req.body, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const account = await accountsService.update(req.params.id, value, req.user.id);
    new ApiResponse(200, true, 'Account updated', account).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/accounts/:id  (soft-delete)
 */
const remove = async (req, res, next) => {
  try {
    await accountsService.remove(req.params.id);
    new ApiResponse(200, true, 'Account deleted').send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };
