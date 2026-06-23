const express = require('express');
const accountsController = require('./accounts.controller');
const { protect } = require('../../common/middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(accountsController.list)    // GET  /accounts?page=1&limit=20&search=abc
  .post(accountsController.create); // POST /accounts

router.route('/:id')
  .get(accountsController.getOne)    // GET   /accounts/:id
  .patch(accountsController.update)  // PATCH /accounts/:id
  .delete(accountsController.remove); // DELETE /accounts/:id (soft-delete)

module.exports = router;
