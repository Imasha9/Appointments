const pool = require('../config/db');

// ✅ Get all available slots
const getAvailableSlots = async (req, res) => {
  try {
    const [slots] = await pool.query('SELECT * FROM slots WHERE is_booked = 0');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// ✅ Add a new slot
const addAvailableSlot = async (req, res) => {
  const { date, timeSlot } = req.body;

  if (!date || !timeSlot) {
    return res.status(400).json({ message: 'Date and time slot are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO slots (date, time_slot, is_booked, available) VALUES (?, ?, 0, true)',
      [date, timeSlot]
    );
    

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Insert failed: No rows affected' });
    }
    

    res.status(201).json({ message: 'Slot added successfully', slotId: result.insertId });
  } catch (error) {
    console.error('Database Error:', error);  // Log error for debugging
    res.status(500).json({ message: 'Database error', error: error.message });
  }
  
};

// ✅ Delete a slot
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
  getAvailableSlots,
  addAvailableSlot,
  deleteSlot,
};
