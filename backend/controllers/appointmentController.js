const pool = require('../config/db');

// Get available slots for a specific date
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;  // Date passed in query (YYYY-MM-DD)
    
    // Validate the date
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Query the database to get available slots for the given date
    const [results] = await pool.query('SELECT * FROM slots WHERE available = 1 AND date = ?', [date]);

    // Check if there are any available slots for the given date
    if (results.length === 0) {
      return res.status(404).json({ message: 'No available slots for this date' });
    }

    // Return the available slots if found
    res.status(200).json(results);
  } catch (error) {
    // Handle any database errors
    console.error(error);
    res.status(500).json({ message: 'Database error', error });
  }
};


// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { date, timeSlot, name, contact, userId } = req.body;
    const [result] = await pool.query(
      'INSERT INTO appointments (date, time_slot, name, contact, user_id) VALUES (?, ?, ?, ?, ?)',
      [date, timeSlot, name, contact, userId]
    );
    await pool.query('UPDATE slots SET available = 0 WHERE time_slot = ? AND date = ?', [timeSlot, date]); // Mark slot as booked
    res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// Retrieve user appointments
// Inside your appointment controller
const getAllAppointments = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM appointments');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error', error });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request params
    const [results] = await pool.query('SELECT * FROM appointments WHERE user_id = ?', [userId]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error', error });
  }
};
// appointmentController.js
const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;  // Get the appointment ID from the request parameters
    
    // Your code to delete the appointment from the database
    await pool.query('DELETE FROM appointments WHERE id = ?', [appointmentId]);

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};




module.exports = { getAvailableSlots, bookAppointment, getAllAppointments, deleteAppointment,getUserAppointments };
