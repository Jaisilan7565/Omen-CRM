const mastersService = require('./masters.service');
const ApiResponse = require('../../common/api/ApiResponse');

/**
 * GET /api/v1/masters?category=INDUSTRY
 * Returns flat list for a single category (for lazy-loaded selects).
 */
const list = async (req, res, next) => {
  try {
    const { category } = req.query;
    const data = await mastersService.listByCategory(category);
    new ApiResponse(200, true, 'Masters fetched', data).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/masters/grouped
 * Returns all categories grouped — for batch dropdown loading on page mount.
 */
const grouped = async (req, res, next) => {
  try {
    const data = await mastersService.getAllGrouped();
    new ApiResponse(200, true, 'Grouped masters fetched', data).send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, grouped };
