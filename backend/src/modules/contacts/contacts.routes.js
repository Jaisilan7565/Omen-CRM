const express = require('express');
const contactsController = require('./contacts.controller');
const { protect } = require('../../common/middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(contactsController.list)    // GET  /api/v1/contacts
  .post(contactsController.create); // POST /api/v1/contacts

router.route('/:id')
  .get(contactsController.getOne)    // GET   /api/v1/contacts/:id
  .patch(contactsController.update); // PATCH /api/v1/contacts/:id

router.patch('/:id/toggle-status', contactsController.toggleStatus); // PATCH /api/v1/contacts/:id/toggle-status

module.exports = router;
