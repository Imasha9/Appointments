const pool = require('../config/db');

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const [appointments] = await pool.query('SELECT * FROM appointments');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// Get available slots
const getAvailableSlots = async (req, res) => {
  try {
    const [slots] = await pool.query('SELECT * FROM slots WHERE is_booked = FALSE');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

const addAvailableSlot = async (req, res) => {
    const { date, timeSlot } = req.body;
  
    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'Date and time slot are required' });
    }
  
    try {
      const [result] = await pool.query(
        'INSERT INTO slots (date, time_slot, is_booked) VALUES (?, ?, FALSE)',
        [date, timeSlot]
      );
  
      console.log('Insert result:', result); // ✅ Debugging log
  
      if (result.affectedRows === 0) {
        return res.status(500).json({ message: 'Insert failed' });
      }
  
      res.status(201).json({ message: 'Slot added successfully', slotId: result.insertId });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Database error', error });
    }
  };
  
  

// Delete an available slot
const deleteSlot = async (req, res) => {
  const { slotId } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM slots WHERE id = ?', [slotId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

module.exports = {
  getAllAppointments,
  getAvailableSlots,
  addAvailableSlot,
  deleteSlot,
};
