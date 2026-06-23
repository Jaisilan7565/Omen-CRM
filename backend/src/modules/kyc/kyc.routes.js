const express = require('express');
const kycController = require('./kyc.controller');
const { protect } = require('../../common/middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(kycController.list)    // GET  /kyc?page=1&limit=20&search=abc
  .post(kycController.create); // POST /kyc

router.route('/:id')
  .get(kycController.getOne)    // GET    /kyc/:id
  .patch(kycController.update)  // PATCH  /kyc/:id
  .delete(kycController.remove); // DELETE /kyc/:id (soft-delete)

module.exports = router;
