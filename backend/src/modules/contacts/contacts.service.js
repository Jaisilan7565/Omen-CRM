const { Op } = require('sequelize');
const db = require('../../database/models');
const ApiError = require('../../common/api/ApiError');

// ── List ─────────────────────────────────────────────────────────────────────
const list = async ({ page, limit, search, status, sortBy, sortDir, excludeId }) => {
  const offset = (page - 1) * limit;
  const where  = {};

  if (status) where.status = status;
  if (excludeId) where.id = { [Op.ne]: excludeId };
  if (search) where[Op.or] = [
    { fullName: { [Op.iLike]: `%${search}%` } },
    { email:    { [Op.iLike]: `%${search}%` } },
  ];

  const dbSortBy = sortBy === 'fullName' ? 'full_name' : sortBy;

  const { count, rows } = await db.Contact.findAndCountAll({
    where,
    limit,
    offset,
    order: [[dbSortBy, sortDir]]
  });

  // Assign virtual roles dynamically (e.g. for the Platform Admin)
  rows.forEach(row => {
    const roles = row.email === 'jaisilan@gmail.com'
      ? [{ code: 'PLATFORM_ADMIN', name: 'Platform Administrator' }, { code: 'ADMIN', name: 'Administrator' }]
      : [];
    row.setDataValue('roles', roles);
  });

  return {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

// ── Get one ──────────────────────────────────────────────────────────────────
const getById = async (id) => {
  const contact = await db.Contact.findByPk(id);
  if (!contact) throw new ApiError(404, 'Contact not found');
  
  // Assign virtual roles dynamically
  const roles = contact.email === 'jaisilan@gmail.com'
    ? [{ code: 'PLATFORM_ADMIN', name: 'Platform Administrator' }, { code: 'ADMIN', name: 'Administrator' }]
    : [];
  contact.setDataValue('roles', roles);

  return contact;
};

// ── Create ───────────────────────────────────────────────────────────────────
const create = async (payload) => {
  const { password, role, ...rest } = payload;

  // Check for duplicate email
  const existing = await db.Contact.findOne({ where: { email: rest.email } });
  if (existing) throw new ApiError(409, 'A contact with this email already exists');

  const contact = await db.Contact.create(rest);

  return getById(contact.id);
};

// ── Update ───────────────────────────────────────────────────────────────────
const update = async (id, payload) => {
  const { role, ...rest } = payload;
  const contact = await getById(id);

  if (rest.email && rest.email !== contact.email) {
    const existing = await db.Contact.findOne({ where: { email: rest.email } });
    if (existing) throw new ApiError(409, 'A contact with this email already exists');
  }

  await contact.update(rest);

  return getById(id);
};

// ── Soft-toggle status ────────────────────────────────────────────────────────
const toggleStatus = async (id) => {
  const contact = await getById(id);
  const newStatus = contact.status === 'active' ? 'inactive' : 'active';
  await contact.update({ status: newStatus });
  return getById(id);
};

module.exports = { list, getById, create, update, toggleStatus };
