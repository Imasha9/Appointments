const express = require('express');
const slotController = require('../controllers/slotController');

const router = express.Router();

// ✅ View available slots
router.get('/slots', slotController.getAvailableSlots);

// ✅ Add a new slot
router.post('/slots', slotController.addAvailableSlot);

// ✅ Delete a slot
router.delete('/slots/:slotId', slotController.deleteSlot);

module.exports = router;
