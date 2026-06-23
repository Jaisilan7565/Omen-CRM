const contactsService = require('./contacts.service');
const { createContactSchema, updateContactSchema, listContactsSchema } = require('./contacts.validation');
const ApiResponse = require('../../common/api/ApiResponse');
const ApiError = require('../../common/api/ApiError');

/**
 * GET /api/v1/contacts
 */
const list = async (req, res, next) => {
  try {
    const { error, value } = listContactsSchema.validate(req.query, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const result = await contactsService.list({ ...value, excludeId: req.user?.id });
    new ApiResponse(200, true, 'Contacts fetched', result).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/contacts/:id
 */
const getOne = async (req, res, next) => {
  try {
    const contact = await contactsService.getById(req.params.id);
    new ApiResponse(200, true, 'Contact fetched', contact).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/contacts
 */
const create = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const contact = await contactsService.create(value);
    new ApiResponse(201, true, 'Contact created successfully', contact).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/contacts/:id
 */
const update = async (req, res, next) => {
  try {
    const { error, value } = updateContactSchema.validate(req.body, { abortEarly: false });
    if (error) throw new ApiError(422, 'Validation failed', error.details);

    const contact = await contactsService.update(req.params.id, value);
    new ApiResponse(200, true, 'Contact updated', contact).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/v1/contacts/:id/toggle-status
 */
const toggleStatus = async (req, res, next) => {
  try {
    // Prevent users from deactivating themselves
    if (req.params.id === req.user.id) {
      throw new ApiError(403, 'You cannot deactivate your own account');
    }
    const contact = await contactsService.toggleStatus(req.params.id);
    new ApiResponse(200, true, 'Contact status updated', contact).send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getOne, create, update, toggleStatus };
