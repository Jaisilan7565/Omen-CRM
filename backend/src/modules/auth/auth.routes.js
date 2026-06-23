const express = require('express');
const authController = require('./auth.controller');
const validate = require('../../common/middlewares/validate.middleware');
const { loginSchema } = require('./auth.validation');
const { protect } = require('../../common/middlewares/auth.middleware');

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.get('/me', protect, authController.me);
router.post('/logout', protect, authController.logout);

module.exports = router;
