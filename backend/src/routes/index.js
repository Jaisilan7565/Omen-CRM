const express = require('express');
const authRouter     = require('../modules/auth/auth.routes');
const mastersRouter  = require('../modules/masters/masters.routes');
const accountsRouter  = require('../modules/accounts/accounts.routes');
const contactsRouter  = require('../modules/contacts/contacts.routes');
const kycRouter       = require('../modules/kyc/kyc.routes');
const settingsRouter  = require('../modules/settings/settings.routes');

const router = express.Router();

// ── API v1 modules ────────────────────────────────────────────────────────────
router.use('/auth',     authRouter);
router.use('/masters',  mastersRouter);
router.use('/accounts', accountsRouter);
router.use('/contacts', contactsRouter); // Now represents internal staff
router.use('/kyc',      kycRouter);      // Now represents client KYC
router.use('/settings', settingsRouter);

module.exports = router;

