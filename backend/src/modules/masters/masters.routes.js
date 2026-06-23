const express = require('express');
const mastersController = require('./masters.controller');
const { protect } = require('../../common/middlewares/auth.middleware');

const router = express.Router();

// All master routes require authentication
router.use(protect);

router.get('/', mastersController.list);           // ?category=INDUSTRY
router.get('/grouped', mastersController.grouped); // all categories grouped

module.exports = router;
