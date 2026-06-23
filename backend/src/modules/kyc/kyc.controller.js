const kycService = require('./kyc.service');
const { createKycSchema, updateKycSchema, listKycSchema } = require('./kyc.validation');
const ApiResponse = require('../../common/api/ApiResponse');
const ApiError    = require('../../common/api/ApiError');

/**
 * GET /api/v1/kyc
 */
const list = async (req, res, next) => {
  try {
    const { error, value } = listKycSchema.validate(req.query, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const result = await kycService.list(value);
    new ApiResponse(200, true, 'KYC records fetched', result).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/kyc/:id
 */
const getOne = async (req, res, next) => {
  try {
    const kyc = await kycService.getById(req.params.id);
    new ApiResponse(200, true, 'KYC record fetched', kyc).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/kyc
 */
const create = async (req, res, next) => {
  try {
    const { error, value } = createKycSchema.validate(req.body, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const kyc = await kycService.create(value, req.user.id);
    new ApiResponse(201, true, 'KYC record created', kyc).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/kyc/:id
 */
const update = async (req, res, next) => {
  try {
    const { error, value } = updateKycSchema.validate(req.body, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const kyc = await kycService.update(req.params.id, value, req.user.id);
    new ApiResponse(200, true, 'KYC record updated', kyc).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/kyc/:id  (soft-delete)
 */
const remove = async (req, res, next) => {
  try {
    await kycService.remove(req.params.id);
    new ApiResponse(200, true, 'KYC record deleted').send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, remove };
