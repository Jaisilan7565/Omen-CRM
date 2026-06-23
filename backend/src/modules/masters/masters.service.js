const db = require('../../database/models');
const ApiError = require('../../common/api/ApiError');

/**
 * List all master records for a given category (or all if omitted).
 * Results are sorted by sort_order ASC.
 */
const listByCategory = async (category) => {
  const where = { isActive: true };
  if (category) where.category = category.toUpperCase();

  return db.Master.findAll({
    where,
    order: [['sortOrder', 'ASC'], ['label', 'ASC']],
    attributes: ['id', 'category', 'code', 'label', 'sortOrder'],
  });
};

/**
 * Return a grouped map: { ACCOUNT_TYPE: [...], INDUSTRY: [...], ... }
 * Useful for populating multiple dropdowns in one request.
 */
const getAllGrouped = async () => {
  const records = await db.Master.findAll({
    where: { isActive: true },
    order: [['category', 'ASC'], ['sortOrder', 'ASC'], ['label', 'ASC']],
    attributes: ['id', 'category', 'code', 'label', 'sortOrder'],
  });

  return records.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push({
      id:    item.id,
      code:  item.code,
      label: item.label,
    });
    return acc;
  }, {});
};

/**
 * Get a single master by id.
 */
const getById = async (id) => {
  const master = await db.Master.findByPk(id);
  if (!master) throw new ApiError(404, 'Master record not found');
  return master;
};

module.exports = { listByCategory, getAllGrouped, getById };
