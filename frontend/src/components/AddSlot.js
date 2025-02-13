import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddSlot = () => {
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const formattedDate = date ? date.toISOString().split('T')[0] : '';  // Format the date

  const handleAddSlot = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: formattedDate, timeSlot }),  // Use formatted date here
      });

      if (response.ok) {
        setMessage('Slot added successfully!');
        setDate(null);
        setTimeSlot('');
      } else {
        setMessage('Failed to add slot. Please try again.');
      }
    } catch (error) {
      setMessage('Server error. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Add a New Time Slot</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Select Date:</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              className="w-full p-2 border rounded mt-1"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Time Slot:</label>
            <input
              type="text"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="e.g., 10:00 AM - 11:00 AM"
              required
            />
          </div>
          <button
            onClick={handleAddSlot}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Slot
          </button>
        </form>
        {message && <p className="text-center text-green-600 mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default AddSlot;
