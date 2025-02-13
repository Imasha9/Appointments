const pool = require('../config/db');

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    console.log("Received appointment request:", req.body); // Debugging

    const { date, timeSlot, name, contact, userId } = req.body;

    if (!date || !timeSlot || !name || !contact || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [result] = await pool.query(
      'INSERT INTO appointments (date, time_slot, name, contact, user_id) VALUES (?, ?, ?, ?, ?)',
      [date, timeSlot, name, contact, userId]
    );

    await pool.query('UPDATE slots SET available = 0 WHERE time_slot = ? AND date = ?', [timeSlot, date]); // Mark slot as booked

    res.status(201).json({ message: 'Appointment booked successfully', appointmentId: result.insertId });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: 'Database error', error });
  }
};


// Get all appointments
const getAppointments = async () => {
  const [rows] = await pool.query('SELECT * FROM appointments');
  return rows;
};

// Cancel an appointment
const cancelAppointment = async (id) => {
  // Retrieve the appointment and slot details
  const [appointment] = await pool.query('SELECT * FROM appointments WHERE id = ?', [id]);
  if (appointment.length === 0) {
    throw new Error('Appointment not found');
  }
  const slotId = appointment[0].slot_id;

  // Delete the appointment
  await pool.query('DELETE FROM appointments WHERE id = ?', [id]);

  // Mark the slot as available again
  await pool.query('UPDATE slots SET is_booked = FALSE WHERE id = ?', [slotId]);

  return { message: 'Appointment canceled successfully' };
};

// Get available slots
const getAvailableSlots = async () => {
  const [rows] = await pool.query('SELECT * FROM slots WHERE is_booked = FALSE');
  return rows;
};

module.exports = { bookAppointment, getAppointments, cancelAppointment, getAvailableSlots };
