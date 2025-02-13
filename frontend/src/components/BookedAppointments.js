import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { AuthContext } from "./AuthContext"; // Import AuthContext

const BookedAppointments = () => {
  const { user } = useContext(AuthContext); // Get logged-in user details
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
  
    console.log("Fetching appointments for User ID:", user.id); // Debugging
  
    axios
    .get(`http://localhost:5000/api/appointments/user/${user.id}`, {
      withCredentials: true, // ✅ Ensures cookies are sent
    })
    .then((response) => {
      setAppointments(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments.");
      setLoading(false);
    });
  
  }, [user]);
  
  
  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      axios
        .delete(`http://localhost:5000/api/appointments`, { withCredentials: true })
        .then(() => {
          setAppointments(appointments.filter((app) => app.id !== id));
          alert("Appointment canceled successfully!");
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Your Appointments
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time Slot</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{appointment.date}</td>
                  <td className="p-3">{appointment.time_slot}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 mx-auto"
                    >
                      <FaTrashAlt /> Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No appointments found.</p>
      )}
    </div>
  );
};

export default BookedAppointments;