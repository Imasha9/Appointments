const express = require('express');
const router = express.Router();

// Import your controller functions
const { getAllAppointments ,getAvailableSlots, bookAppointment, deleteAppointment ,getUserAppointments} = require('../controllers/appointmentController');


// Example DELETE route (ensure it's defined properly)
router.delete('/appointments/:id', deleteAppointment); // Ensure deleteAppointment is correctly imported
router.get('/appointments/user/:userId', getUserAppointments);
router.get('/appointments', getAllAppointments);

// Other routes like GET and POST
router.get('/slots', getAvailableSlots);
router.post('/appointments', bookAppointment);

module.exports = router;
