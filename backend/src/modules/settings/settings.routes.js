const express = require('express');
const settingsController = require('./settings.controller');
const { protect } = require('../../common/middlewares/auth.middleware');

const router = express.Router();

// Require authentication for all settings routes
router.use(protect);

router.post('/seed-dummy', settingsController.triggerDummySeed);
router.post('/clean-db', settingsController.triggerCleanDb);

module.exports = router;
