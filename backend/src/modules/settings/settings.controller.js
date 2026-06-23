const seedDummyData = require('../../../scripts/seed-dummy');
const cleanDatabaseExceptAdmin = require('../../../scripts/clean-db');
const ApiResponse = require('../../common/api/ApiResponse');

/**
 * POST /api/v1/settings/seed-dummy
 * Runs the dummy seeding logic to clean the database and re-seed it.
 */
const triggerDummySeed = async (req, res, next) => {
  try {
    console.log('Dummy seeding triggered from settings API by user:', req.user?.email);
    await seedDummyData();
    new ApiResponse(200, true, 'Database successfully re-seeded with dummy data.').send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/settings/clean-db
 * Clears all CRM records except the Platform Admin contact.
 */
const triggerCleanDb = async (req, res, next) => {
  try {
    console.log('Database clean triggered from settings API by user:', req.user?.email);
    await cleanDatabaseExceptAdmin();
    new ApiResponse(200, true, 'Database successfully cleared of all test records (except admin).').send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { triggerDummySeed, triggerCleanDb };
