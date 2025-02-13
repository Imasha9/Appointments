const express = require('express');
const { getSlots } = require('../controllers/slotController');

const router = express.Router();

router.get('/slots', getSlots);

module.exports = router;