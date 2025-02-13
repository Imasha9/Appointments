import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./AvailableTimeSlots.css";

const AvailableTimeSlots = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ name: "", contact: "" });
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch available slots for the selected date
  const fetchAvailableSlots = async (date) => {
    try {
      const formattedDate = date.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
      const response = await axios.get(`http://localhost:5000/api/slots?date=${formattedDate}`);

      if (response.data && response.data.length > 0) {
        setAvailableSlots(response.data);
        setError(null);
      } else {
        setAvailableSlots([]);
        setError("No slots available for this date.");
      }
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("Failed to fetch slots. Please try again.");
      setAvailableSlots([]);
    }
  };

  // Handle date change in the calendar
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  
    const handleBooking = async () => {
      if (!selectedSlot) {
        return setError("Please select a time slot.");
      }
      
      if (!bookingDetails.name.trim()) {
        return setError("Name is required.");
      }
      
      if (!/^[A-Za-z\s]+$/.test(bookingDetails.name)) {
        return setError("Name must contain only letters.");
      }
    
      if (!bookingDetails.contact.trim()) {
        return setError("Contact is required.");
      }
    
      if (!/^\d{10,}$/.test(bookingDetails.contact)) {
        return setError("Contact must be at least 10 digits.");
      }
    
      try {
        setIsBooking(true);
        const response = await axios.post("http://localhost:5000/api/appointments", {
          slotId: selectedSlot.id,
          userName: bookingDetails.name,
          userContact: bookingDetails.contact,
        });
        setIsBooking(false);
        alert("Booking successful!");
        setBookingDetails({ name: "", contact: "" }); // Reset form
        setSelectedSlot(null); // Close modal
      } catch (err) {
        setIsBooking(false);
        setError("Error booking the appointment.");
      }
    };
    

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="container">
      <h1>Available Time Slots</h1>

      <div className="calendar-container">
        <Calendar
          onChange={handleDateClick}
          value={selectedDate || new Date()}
          tileClassName={({ date }) => {
            const formattedDate = date.toLocaleDateString("en-CA");
            return availableSlots.some(slot => slot.date === formattedDate) ? 'available' : '';
          }}
        />
      </div>

      {selectedDate && <p className="selected-date">Selected Date: {selectedDate.toDateString()}</p>}

      {error && <p className="error">{error}</p>}

      {availableSlots.length > 0 ? (
        <div className="slots-container">
          <h3>Available Time Slots:</h3>
          <ul className="slots-list">
            {availableSlots.map((slot, index) => (
              <li key={index} className="slot-item">
                <button
                  className={`slot-btn ${slot.isBooked ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!slot.isBooked) {
                      setSelectedSlot(slot);
                    }
                  }}
                  disabled={slot.isBooked}
                >
                  {slot.isBooked ? `${slot.time_slot} (Booked)` : slot.time_slot}
                </button>
              </li>
            ))}
          </ul>

          {/* Booking Form Modal */}
          {selectedSlot && (
            <div className="booking-modal">
              <div className="modal-content">
                <h4>Book an Appointment for {selectedSlot.time_slot}</h4>
                <form>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={bookingDetails.name}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Your Contact"
                    value={bookingDetails.contact}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, contact: e.target.value })}
                    className="input-field"
                  />
                  <button type="button" onClick={handleBooking} disabled={isBooking} className="book-btn">
                    {isBooking ? "Booking..." : "Book Appointment"}
                  </button>
                  <button type="button" onClick={() => setSelectedSlot(null)} className="close-btn">Close</button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>No slots available for this date.</p>
      )}
    </div>
  );
};

export default AvailableTimeSlots;
