require('dotenv').config();

const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/db');

const env    = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ── Register models ───────────────────────────────────────────────────────────
db.Contact     = require('./contact.model')(sequelize, Sequelize);
db.Master      = require('./master.model')(sequelize, Sequelize);
db.Account     = require('./account.model')(sequelize, Sequelize);
db.Kyc         = require('./kyc.model')(sequelize, Sequelize);

// ── Wire associations ─────────────────────────────────────────────────────────


// Run each model's own associate() if it defines one
Object.values(db).forEach((model) => {
  if (model && typeof model.associate === 'function') {
    model.associate(db);
  }
});

module.exports = db;

